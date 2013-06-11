# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.
class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  helper_method :sphinx_running?, :current_user, :contribution_fields, 
    :dropbox_authorized?, :dropbox_client, :dropbox_configured?, 
    :europeana_api_configured?
  
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
  
  # Always use the v2 theme
  #theme 'v2'
  
  #
  ##
  
  before_filter :init_session, :init_views, :set_locale
  
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
    rescue_from Aegis::AccessDenied do |exception|
      render_http_error(:forbidden, exception, :log => false)
    end
    
    # Rescue attempts to search when Sphinx offline.
    rescue_from RunCoCo::SearchOffline do |exception|
      render_http_error(:service_unavailable, exception, :template => "/errors/search_offline")
    end
    
    # Rescue Dropbox auth errors.
    rescue_from DropboxAuthError do |exception|
      redirect_to dropbox_connect_path(:redirect => controller.request.fullpath)
    end
  end
  
  ##
  # Rescue "404 Not Found" exceptions
  #
  # First tries to redirect to the same path with the locale prefixed if it's 
  # not already in the request params.
  #
  rescue_from ActionController::MissingFile, ActiveRecord::RecordNotFound, ActionController::UnknownAction, ActionController::MethodNotAllowed, ActionController::RoutingError, ActionView::MissingTemplate do |exception|
    if (!params[:locale].blank? && !I18n.available_locales.include?(params[:locale].to_sym)) && !request.fullpath.match(/^\/(attachments|oai)\//)
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
      admin_root_url
    elsif resource_or_scope.is_a?(User) && resource_or_scope.role_name == 'contributor'
      contributor_dashboard_url
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
    home_path
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
  end
  
  ##
  # Set locale from URL param or HTTP Accept-Language header
  #
  def set_locale # :nodoc:
    if params[:locale].blank?
      # Uses http_accept_language plugin
      locale = request.compatible_language_from(I18n.available_locales) || Rails.configuration.i18n.default_locale
    else
      raise ActionController::RoutingError, "No route matches #{request.path}" unless I18n.available_locales.include?(params[:locale].to_sym)
      locale = params[:locale]
    end
    
    I18n.locale = locale
    (Rails.configuration.action_mailer.default_url_options ||= {}).merge!(:locale => params[:locale])
  end
  
  ##
  # Return the name of the theme to use, for the theme_for_rails gem
  # 
  # @see https://github.com/lucasefe/themes_for_rails
  #
  def theme_resolver
    if params[:theme]
      session[:theme] = params[:theme]
    elsif session[:theme].nil?
      session[:theme] = 'v2'
    end
    
    set_sass_locations(session[:theme])
    
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
    defined?(Europeana) == 'constant' && Europeana.class == Module && Europeana::API.key.present?
  end
  
  ##
  # Translates text to app locales, caching Bing Translator API response for
  # 1 year.
  #
  # @see RunCoCo::BingTranslator.translate
  #
  def bing_translate(text, from_locale = I18n.locale)
    return text unless text.present? && RunCoCo::BingTranslator.configured?
        
    bing_cache_key = "bing/#{from_locale}/#{text}"
    
    if fragment_exist?(bing_cache_key)
      translations = YAML::load(read_fragment(bing_cache_key))
      if translations.is_a?(Hash) && translations.keys == I18n.available_locales
        return translations
      end
      expire_fragment(bing_cache_key)
    end
    
    begin
      translations = RunCoCo::BingTranslator.translate(text, from_locale)
      write_fragment(bing_cache_key, translations.to_yaml, :expires_in => 1.year)
    rescue Exception => exception
      RunCoCo.error_logger.error("Bing Translator: \"#{exception.message}\"")
    end
    
    translations
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
  # Sets Sass CSS and template directories
  #
  # @param [String] theme_name Theme name.
  #
  def set_sass_locations(theme_name)
    Sass::Plugin.options[:css_location] = File.join(Rails.root, 'public', 'themes', theme_name, 'stylesheets')
    Sass::Plugin.options[:template_location] = File.join(Rails.root, 'public', 'themes', theme_name, 'stylesheets', 'sass')
  end
end

