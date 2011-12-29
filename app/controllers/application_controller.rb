# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.
class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  before_filter :init_session, :init_views, :set_locale
  
  unless Rails.configuration.consider_all_requests_local 
    # Rescue general errors
    rescue_from Exception do |exception|
      render_http_error(:internal_server_error, exception)
    end

    # Rescue "400 Bad Request" exceptions
    rescue_from CoCoCo::BadRequest do |exception|
      render_http_error(:bad_request, exception)
    end

    # Rescue "403 Forbidden" exceptions
    rescue_from Aegis::AccessDenied do |exception|
      render_http_error(:forbidden, exception, :log => false)
    end
    
    # Rescue attempts to search when Sphinx offline.
    rescue_from CoCoCo::SearchOffline do |exception|
      render_http_error(:service_unavailable, exception, :template => "/errors/search_offline")
    end

    # Rescue "404 Not Found" exceptions
    rescue_from ActionController::MissingFile, ActiveRecord::RecordNotFound, ActionController::RoutingError, ActionController::UnknownAction, ActionController::MethodNotAllowed, ActionView::MissingTemplate do |exception|
      render_http_error(:not_found, exception)
    end
  end
  
  def default_url_options(options={})
    { :locale => I18n.locale }
  end
  
  # Returns the logged-in user object, or initialises a new instance if not logged in.
  def current_user
    @current_user ||= (super || User.new)
  end
  helper_method :current_user

  protected
  # Displays error message for application errors, sending HTTP status code.
  #
  # +status+ is a symbol representing the HTTP error code, e.g. +:not_found+
  # 
  # +exception+ is the Ruby exception raised.
  #
  # Configuration options:
  # * +:log+ - Specifies whether to log the error (default is +true+).
  # * +:template+ - Path to the template to render (default is derived from +status+, e.g. "/errors/not_found").
  #--
  # FIXME: rescue_from blocks should only render HTML if request is for HTML.
  #++
  def render_http_error(status, exception, *args)
    options = args.extract_options!
    options.reverse_merge!(:log => true, :template => "/shared/error")

    if options[:log]
      CoCoCo.error_logger.error("#{status.to_s.humanize} \"#{exception.message}\"\n#{Rails.backtrace_cleaner.clean(exception.backtrace).join("\n")}")
    end
    
    @status = status
    render :template => options[:template], :status => status
  end

  # Handle Devise redirects after sign in
  def after_sign_in_path_for(resource_or_scope)
    if resource_or_scope.is_a?(User) && resource_or_scope.may_access_admin_area?
      admin_root_url
    elsif resource_or_scope.is_a?(User) && resource_or_scope.role_name == 'contributor'
      contributor_dashboard_url
    else
      super
    end
  end
  
  #  Devise redirects after sign out
  def after_sign_out_path_for(resource_or_scope)
    home_path
  end
  
  def redirect_to(options = {}, response_status = {})
    if params[:redirect] && (params[:redirect] =~ /^\//)
      super(params[:redirect], response_status)
    else
      super(options, response_status)
    end
  end
  
  # Initialise session.
  def init_session # :nodoc:
    # Store guest user details in session
    if current_user.role.name == 'guest'
      session[:guest] ||= {}
      if session[:guest][:contact_id].present?
        current_user.contact_id = session[:guest][:contact_id]
      end 
    end
  end
  
  # Initialise instance variables for views.
  def init_views # :nodoc:
    # Flags for optional javascripts.
    # Views or controllers can set these to true to enable inclusion of 
    # the relevant javascript.
    @javascripts = {
      :datepicker => false,
      :gmap_geo => false,
      :uploadify => false,
      :collapsible => false
    }
  end
  
  # Set locale from URL param or HTTP Accept-Language header
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

  # Search contributions.
  #
  # Uses ThinkingSphinx if available. If not, falls back to a simple
  # non-indexed SQL query.
  #
  # +set+ specifies which contributions to search: +:approved+, +:submitted+ or +:published+.
  #
  # +query+ contains the full-text query to pass to the search engine (default is +nil+).
  # With ThinkingSphinx, this will search against contribution titles and
  # any metadata fields flagged as searchable. The SQL fallback will only search
  # the contribution titles. If +nil+, returns all contributions, (unless
  # Sphinx search conditions given in +options+).
  #
  # Options:
  # * +:order+ - How to order the results, e.g "approved_at DESC" (default is unordered).
  # * +:page+ - Page of results to return.
  # * +:per_page+ - Number of results to return per page.
  #
  # You can also pass any valid ThinkingSphinx +search+ options.
  # See http://freelancing-god.github.com/ts/en/searching.html
  def search_contributions(set, query = nil, options = {})
    raise ArgumentError, "set should be :published, :approved or :submitted, got #{set.inspect}" unless [ :approved, :submitted, :published ].include?(set)
    
    if sphinx_running?
      sphinx_search_contributions(set, query, options)
    else
      activerecord_search_contributions(set, query, options)
    end
  end
  
  def sphinx_running?
    ThinkingSphinx.sphinx_running?
  end
  helper_method :sphinx_running?
  
  def contribution_fields
    @contribution_fields ||= [
      [ t('attributes.title'), 'title'], 
      [ t('activerecord.attributes.contribution.attachments'), 'attachments' ], 
      [ t('activerecord.attributes.contribution.created_at'), 'created_at' ],
      [ t('activerecord.attributes.contribution.contributor'), 'contributor' ],
      [ t('activerecord.attributes.contribution.approver'), 'approver' ]
    ] + MetadataField.all.collect do |field| 
      [ field.title, (field.field_type == 'taxonomy' ? field.collection_id.to_s : field.column_name) ]
    end
  end
  helper_method :contribution_fields
  
  protected
  # Simple text query against contributions.
  #
  # Only intended as a backup if Sphinx is not running.
  #--
  # FIXME: For Rails 3's ActiveRecord
  #++
  def activerecord_search_contributions(set, query = nil, options = {}) # :nodoc:
    where = [ {
      :approved => 'approved_at IS NOT NULL',
      :submitted => 'approved_at IS NULL AND submitted_at IS NOT NULL',
      :published => 'published_at IS NOT NULL'
    }[set] ]
    
    unless query.nil?
      where[0] << ' AND title LIKE ?'
      where << "%#{query}%"
    end
    
    results = Contribution.where(where).order(options[:order])
      
    if options.has_key?(:page)
      results = results.paginate(options)
    end
    
    results
  end  
  
  # Searches contributions using Sphinx.
  def sphinx_search_contributions(set, query = nil, options = {}) # :nodoc:
    unless sphinx_running?
      raise CoCoCo::SearchOffline
    end
    
    options.merge! case set
    when :approved
      { :without => { :approved_at => 0 } }
    when :submitted
      { :without => { :submitted_at => 0 }, :with => { :approved_at => 0 } }
    when :published
      { :without => { :published_at => 0 } }
    end
    
    if query.nil?
      Contribution.search(options)
    else
      Contribution.search(query, options)
    end
  end
end

