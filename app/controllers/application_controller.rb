# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.
class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  helper_method :sphinx_running?, :current_user, :contribution_fields,
    :dropbox_authorized?, :dropbox_client, :dropbox_configured?,
    :europeana_api_configured?, :flickr_configured?, :search_result_to_edm,
    :get_http_headers

  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  ##
  # Theme support via themes_for_rails gem.
  #
  # Only one of the following "theme..." lines should be active at a time.
  #

  # Use the #theme_resolver method to determine which theme to display,
  # allowing override via the "theme" query param, stored in the user's
  # session.
  theme :theme_resolver

  # Always use the full theme
  #theme "full"

  #
  ##

  before_filter :init_session, :init_views, :set_locale, :init_configuration

  unless Rails.configuration.consider_all_requests_local
    # Rescue general errors
    rescue_from Exception do |exception|
      render_http_error(:internal_server_error, exception)
    end

    # Rescue "400 Bad Request" exceptions
    rescue_from RunCoCo::BadRequest do |exception|
      render_http_error(:bad_request, exception)
    end

    # Rescue "403 Forbidden" exceptions
    rescue_from Aegis::AccessDenied, ActionController::InvalidAuthenticityToken do |exception|
      render_http_error(:forbidden, exception, :log => false)
    end

    # Rescue attempts to search when Sphinx or Solr are offline.
    rescue_from RunCoCo::SearchOffline do |exception|
      @status = "search_offline"
      render :template => '/pages/error', :status => 503
    end

    # Rescue Dropbox auth errors.
    rescue_from DropboxAuthError do |exception|
      redirect_to dropbox_connect_path(:redirect => controller.request.fullpath)
    end

    # Rescue API errors
    rescue_from Europeana::Errors::ResponseError do |exception|
      @status = "api_error"
      render :template => '/pages/error', :status => 500
    end
  end

  ##
  # Rescue "404 Not Found" exceptions
  #
  # First tries to redirect to the same path with the locale prefixed if it's
  # not already in the request params.
  #
  rescue_from ActionController::MissingFile, ActiveRecord::RecordNotFound, AbstractController::ActionNotFound, ActionController::MethodNotAllowed, ActionController::RoutingError, ActionView::MissingTemplate, AWS::S3::Errors::NoSuchKey do |exception|
    if (!I18n.locale.blank? && I18n.available_locales.include?(I18n.locale.to_sym)) && (params[:locale].to_sym != I18n.locale.to_sym) && !request.fullpath.match(/^\/(attachments|oai)\//)
      redirect_to "/#{I18n.locale.to_s}#{request.fullpath}"
    elsif (!params[:locale].blank? && !I18n.available_locales.include?(params[:locale].to_sym)) && !request.fullpath.match(/^\/(attachments|oai)\//)
      I18n.locale = request.compatible_language_from(I18n.available_locales) || Rails.configuration.i18n.default_locale
      redirect_to "/#{I18n.locale.to_s}#{request.fullpath}"
    elsif Rails.configuration.consider_all_requests_local
      raise exception
    else
      render_http_error(:not_found, exception)
    end
  end

  ##
  # Adds user's locale to default URL options
  #
  # @return [Hash] Default URL options
  def default_url_options(options = {})
    { :locale => I18n.locale }
  end

  # Returns the logged-in user object, or initialises a new instance if not logged in.
  def current_user
    @current_user ||= (super || User.new)
  end

  def dropbox_configured?
    RunCoCo::Dropbox.app_key.present? && RunCoCo::Dropbox.app_secret.present?
  end

  def dropbox_authorized?
    session.has_key?(:dropbox) && session[:dropbox].has_key?(:session)
  end

  def dropbox_client
    return false unless session.has_key?(:dropbox) && session[:dropbox].has_key?(:session)
    unless @dropbox_client.present?
      dbsession = DropboxSession.deserialize(session[:dropbox][:session])
      @dropbox_client = DropboxClient.new(dbsession, :app_folder)
    end
    @dropbox_client
  end

  def search_result_to_edm(result)
    if result.is_a?(Contribution) || result.is_a?(EuropeanaRecord)
      cached_edm_result(result)
    else
      result
    end
  end

protected

  ##
  # Displays error message for application errors, sending HTTP status code.
  #
  # @param [Symbol] status HTTP error code, e.g. :not_found
  # @param [Exception] exception the Ruby exception raised
  # @param [Hash] options error handling options
  # @option options [Boolean] :log Specifies whether to log the error. Default
  #   is +true+.
  # @option options [String] :template Path to the template to render. Default
  #   is derived from +status+, e.g. "/errors/not_found" when status =>
  #   :not_found.
  #
  def render_http_error(status, exception, options = {})
    options.assert_valid_keys(:log, :template)
    options.reverse_merge!(:log => true, :template => "/pages/error")

    if options[:log]
      RunCoCo.error_logger.error("#{status.to_s.humanize} \"#{exception.message}\"\n#{Rails.backtrace_cleaner.clean(exception.backtrace).join("\n")}")
    end

    respond_to do |format|
      format.html do
        @status = status
        render :template => options[:template], :status => status
      end
      format.any(:xml, :text, :csv, :json) do
        render :text => status.to_s.humanize, :status => status, :content_type => 'text/plain'
      end
    end
  end

  ##
  # Handle Devise redirects after sign in
  #
  # @param (see Devise::Controllers::Helpers#after_sign_in_path_for)
  # @return [String] URL to redirect to
  #
  def after_sign_in_path_for(resource_or_scope)
    if params[:redirect] && (params[:redirect] =~ /^\//)
      params[:redirect]
    elsif resource_or_scope.is_a?(User) && resource_or_scope.may_access_admin_area?
      admin_root_url(locale: session[:locale])
    elsif resource_or_scope.is_a?(User) && resource_or_scope.role_name == 'contributor'
      contributor_dashboard_url(locale: session[:locale])
    else
      super
    end
  end

  ##
  #  Devise redirects after sign out
  #
  # @param (see Devise::Controllers::Helpers#after_sign_out_path_for)
  # @return [String] URL to redirect to
  #
  def after_sign_out_path_for(resource_or_scope)
    contributor_dashboard_path(:theme => @theme)
  end

  ##
  # Allow "redirect" URL parameter to override redirect requests.
  #
  # Restricted to local redirects.
  #
  # @param options (see ActionController::Redirecting#redirect_to)
  # @param response_status (see ActionController::Redirecting#redirect_to)
  # @param [Boolean] check_params If false, do not check for URL redirect param
  # @return (see ActionController::Redirecting#redirect_to)
  #
  def redirect_to(options = {}, response_status = {}, check_params = true)
    if check_params && params[:redirect] && (params[:redirect] =~ /^\//)
      super(params[:redirect], response_status)
    else
      super(options, response_status)
    end
  end

  ##
  # Initialise session.
  #
  def init_session # :nodoc:
    # Store guest user details in session
    if current_user.role.name == 'guest'
      session[:guest] ||= {}
      if session[:guest][:contact_id].present?
        current_user.contact_id = session[:guest][:contact_id]
      end
    end
  end

  ##
  # Initialise instance variables for views.
  #
  def init_views # :nodoc:
    ##
    # Flags for optional javascripts, to be set in views.
    #
    # @example
    #   <% @javascripts[:date_picker] = true -%>
    #
    @javascripts = {}

    ##
    # Flags for optional stylesheets, to be set in views.
    #
    # @example
    #   <% @stylesheets[:index] = true -%>
    #
    @stylesheets = {}

    @iframe_parent_domains = if RunCoCo::Application.config.respond_to?(:iframe_parent_domains)
                               RunCoCo::Application.config.iframe_parent_domains
                             else
                               nil
                             end
  end

  def init_configuration
    if RunCoCo::Application.config.action_controller.perform_caching && RunCoCo::Application.config.action_controller.cache_classes
      if Rails.cache.exist?("runcoco.configuration")
        RunCoCo.configuration = RunCoCo::Configuration.new(Rails.cache.read("runcoco.configuration"))
      else
        Rails.cache.write("runcoco.configuration", RunCoCo.configuration.to_array)
      end
    else
      RunCoCo.configuration = RunCoCo::Configuration.new
    end
  end

  ##
  # Set locale from session, URL param or HTTP Accept-Language header
  #
  def set_locale # :nodoc:
    if params[:locale].blank?
      # Uses http_accept_language plugin
      locale = request.compatible_language_from(I18n.available_locales) || Rails.configuration.i18n.default_locale
    elsif I18n.available_locales.include?(params[:locale].to_sym)
      if RunCoCo.configuration.ui_locales.include?(params[:locale])
        locale = params[:locale]
      else
        redirect_to url_for(request.query_parameters.merge({ :locale => Rails.configuration.i18n.default_locale })), :status => 307
        return
      end
    end

    if locale.blank?
      if session[:locale].present?
        # Read from session if present
        locale = session[:locale]
      else
        raise ActionController::RoutingError, "No route matches #{request.path}"
      end
    end

    I18n.locale = session[:locale] = locale
  end

  ##
  # Return the name of the theme to use, for the theme_for_rails gem
  #
  # @see https://github.com/lucasefe/themes_for_rails
  #
  def theme_resolver
    valid_themes = [ "full", "minimal" ]
    default_theme = "full"

    if params[:theme] && valid_themes.include?(params[:theme])
      session[:theme] = params[:theme]
    elsif !valid_themes.include?(session[:theme])
      session[:theme] = default_theme
    end

    @theme = session[:theme]

    session[:theme]
  end

  ##
  # Tests whether Sphinx search engine is running.
  #
  # @return (see ThinkingSphinx.sphinx_running?)
  #
  def sphinx_running?
    ThinkingSphinx.sphinx_running?
  end

  ##
  # Checks whether the Europeana API library is configured.
  #
  # @return [Boolean]
  #
  def europeana_api_configured?
    defined?(Europeana) == 'constant' && Europeana.class == Module && Europeana::api_key.present?
  end

  ##
  # Checks whether Flickr API library is configured.
  #
  # @return [Boolean]
  #
  def flickr_configured?
    !defined?(FlickRaw).nil? && FlickRaw.api_key.present? && FlickRaw.shared_secret.present?
  end

  ##
  # Translates text to app locales, caching Bing Translator API response for
  # 1 year.
  #
  # @see RunCoCo::BingTranslator.translate
  #
  def bing_translate(text, from_locale = I18n.locale)
    return text unless text.present? && RunCoCo::BingTranslator.configured?
    return text if self.class.class_variable_defined?(:@@bing_translate_retry_time) && (Time.now < self.class.class_variable_get(:@@bing_translate_retry_time))

    bing_cache_key = "bing/#{from_locale}/#{text}"

    if fragment_exist?(bing_cache_key)
      translations = YAML::load(read_fragment(bing_cache_key))
      if translations.is_a?(Hash)
        return translations
      end
      expire_fragment(bing_cache_key)
    end

    begin
      translations = RunCoCo::BingTranslator.translate(text, from_locale)
      expiration = Rails.configuration.cache_store.first == :dalli_store ? 1.year.from_now.to_i : 1.year
      write_fragment(bing_cache_key, translations.to_yaml, :expires_in => expiration)
    rescue Exception => exception
      if Rails.configuration.consider_all_requests_local
        raise exception
      else
        if exception.message.match(/The Azure Market Place Translator Subscription associated with the request credentials has zero balance/)
          # Query quota exceeded; wait one day before trying again
          self.class.class_variable_set(:@@bing_translate_retry_time, Time.now + 24.hours)
        end
        RunCoCo.error_logger.error("Bing Translator: \"#{exception.message}\"")
        translations = text
      end
    end

    translations
  end
  
  def openskos_concept_label(uri)
    openskos_cache_key = "openskos/#{uri.to_s}"

    if fragment_exist?(openskos_cache_key)
      skos_concept = YAML::load(read_fragment(openskos_cache_key))
    else
      skos_concept = OpenSKOS::Concept.find(URI.parse(uri), :format => 'json')
      expiration = Rails.configuration.cache_store.first == :dalli_store ? 1.day.from_now.to_i : 1.day
      write_fragment(openskos_cache_key, skos_concept.to_yaml, :expires_in => expiration)
    end
    
    if skos_concept["prefLabel@#{I18n.locale.to_s}"]
      skos_concept["prefLabel@#{I18n.locale.to_s}"].first
    elsif skos_concept["prefLabel@#{I18n.default_locale.to_s}"]
      skos_concept["prefLabel@#{I18n.default_locale.to_s}"].first
    else
      uri
    end
  rescue RestClient::ResourceNotFound, OpenSKOS::Errors::URLError
    uri
  end

  ##
  # Returns the fields associated with contributions.
  #
  # This includes title, attachments (i.e. number of), created at timestamp,
  # contributor (i.e. full name)
  #
  # @return [Array<Array>] Contribution fields. Each array contains two members:
  #   the first is the I18n'd field name, the second an identifier that can be
  #   passed to ContributionsHelper#contribution_field_value as the
  #   +field_name+ param
  #
  def contribution_fields
    @contribution_fields ||= [
      [ t('attributes.title'), 'title'],
      [ t('activerecord.attributes.contribution.attachments'), 'attachments' ],
      [ t('activerecord.attributes.contribution.cataloguer'), 'cataloguer' ],
      [ t('activerecord.attributes.contribution.created_at'), 'created_at' ],
      [ t('activerecord.attributes.contribution.contributor'), 'contributor' ],
    ] + MetadataField.where(:contribution => true).collect do |field|
      [ field.title, (field.field_type == 'taxonomy' ? field.collection_id.to_s : field.column_name) ]
    end
  end

  ##
  # Appends a wildcard character to a string unless already present.
  #
  # @param [String] string String to append wildcard to
  # @return [String] String with wildcard appended
  #
  def append_wildcard(string)
    string + (string.last == '*' ? '' : '*')
  end

  ##
  # Adds quote marks around string(s).
  #
  # @param [String,Array<String>] terms String or array of strings to quote.
  # @return [String,Array<String>] Quoted version of passed string(s).
  #
  def quote_terms(terms)
    quoted_terms = [terms].flatten.uniq.collect do |term|
      '"' + term + '"'
    end
    terms.is_a?(Array) ? quoted_terms : quoted_terms.first
  end

  ##
  # Requires and returns the Ruby-version-specific library used for CSV processing
  #
  # For Ruby >= 1.9, returns CSV, otherwise FasterCSV.
  #
  # @return [Class] CSV class
  #
  def csv_class # :nodoc:
    if RUBY_VERSION >= "1.9"
      require 'csv'
      CSV
    else
      require 'fastercsv'
      FasterCSV
    end
  end

  ##
  # Caches information about search facets from various providers
  #
  # @param [String,Symbol] provider Provider identifier
  # @param [Array<Hash>] facets Facet data
  #
  def cache_search_facets(provider, facets)
    cache_key = "search/facets/#{provider.to_s}"

    cached_facets = fragment_exist?(cache_key) ? YAML::load(read_fragment(cache_key)) : []
    updated_facets = cached_facets.collect(&:deep_dup)

    facets.each do |facet|
      if known_facet = updated_facets.find { |f| f["name"] == facet["name"] }
        new_fields = facet["fields"].collect { |field| field["search"] }
        known_facet["fields"].reject! { |field| new_fields.include?(field["search"]) }
        known_facet["fields"] = known_facet["fields"] + facet["fields"]
      else
        updated_facets << { "name" => facet["name"], "label" => facet["label"], "fields" => facet["fields"] }
      end
    end

    updated_facets.each do |facet|
      facet["fields"] = facet["fields"].collect do |field|
        field_dup = field.deep_dup
        field_dup.delete("count")
        field_dup
      end
    end

    if cached_facets != updated_facets
      write_fragment(cache_key, updated_facets.to_yaml)
      updated_facets
    else
      cached_facets
    end
  end

  ##
  # Restores information about previously selected search facets
  #
  # @param [String,Symbol] provider Provider identifier
  # @param [Array<Hash>] facets Facet data
  # @todo Re-factor so this is not dependent on caching being enabled...
  #
  def preserve_params_facets(provider, facets)
    cache_key = "search/facets/#{provider.to_s}"
    unless fragment_exist?(cache_key) && extracted_facet_params.present?
      return facets
    end

    cached_facets = YAML::load(read_fragment(cache_key))

    extracted_facet_params.each_pair do |param_facet_name, param_facet_fields|
      if i = facets.index { |facet| facet["name"] == param_facet_name }
        [ param_facet_fields ].flatten.each do |param_field|
          unless facets[i]["fields"].find { |field| field["search"] == param_field }
            if cached_facet = cached_facets.find { |cfacet| cfacet["name"] == param_facet_name }
              if cached_field = cached_facet["fields"].find { |cfield| cfield["search"] == param_field }
                facets[i]["fields"] << cached_field
              end
            end
          end
        end
      else
        if cached_facet = cached_facets.find { |cfacet| cfacet["name"] == param_facet_name }
          facet_dup = cached_facet.deep_dup
          facet_dup["fields"].reject! { |field| ![ param_facet_fields ].flatten.include?(field["search"]) }
          facets << facet_dup
        end
      end
    end

    facets
  end

  def extracted_facet_params
    return (params[:qf] || HashWithIndifferentAccess.new).dup
  end

  def redirect_to_collection_controller
    if RunCoCo.configuration.search_engine == :solr
      params[:controller] = :collection
      redirect_to params
    end
  end

  def rewrite_qf_array_param_as_hash
    if params[:qf] && params[:qf].is_a?(Array)
      facets = {}
      params[:qf].each do |facet_row|
        facet_row_parts = facet_row.match(/^([^:]+):(.+)$/)
        unless facet_row_parts.nil?
          facet_name, row_value = facet_row_parts[1], facet_row_parts[2]
          facets[facet_name] ||= []
          facets[facet_name] << row_value
        end
      end
      params[:qf] = facets

      redirect_to params
    end
  end

  def get_http_headers(url)
    url = URI.parse(url)
    response = nil
    Net::HTTP.start(url.host, url.port) { |http|
      path = url.path
      if url.query.present?
        path = path + '?' + url.query
      end
      response = http.head(path)
    }
    response
  end

  def get_http_content(url)
    Net::HTTP.get_response(URI.parse(url))
  end

  def cached_edm_result(result)
    return result unless result.is_a?(Contribution) || result.is_a?(EuropeanaRecord)

    cache_key = "#{result.class.to_s.underscore.pluralize}/edm/result/#{result.id}"

    if fragment_exist?(cache_key)
      edm = YAML::load(read_fragment(cache_key))
    else
      if result.is_a?(Contribution)
        edm = result.edm.as_result
      else
        edm = result.to_edm_result
      end

      write_fragment(cache_key, edm.to_yaml)
    end

    if result.is_a?(Contribution)
      edm['guid'] = contribution_path(edm['id'])
    elsif result.is_a?(EuropeanaRecord)
      edm['guid'] = europeana_record_path(edm['id'][1..-1])
    end

    edm
  end
end
