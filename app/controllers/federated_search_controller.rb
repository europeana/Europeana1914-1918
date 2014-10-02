##
# Abstract controller for federated searches.
#
class FederatedSearchController < SearchController
  before_filter :load_api_key
  before_filter :configured?

  class RecordNotFoundError < StandardError
    attr_reader :id

    def initialize(id)
      @id = id
    end
  end

  class ResponseError < StandardError
    attr_reader :response

    def initialize(response)
      @response = response
    end
  end

  unless Rails.configuration.consider_all_requests_local
    rescue_from RecordNotFoundError do |exception|
      logger.error("ERROR: No record found from #{controller_name} API with ID #{exception.id}")
      render_http_error(:not_found, exception)
    end

    rescue_from ResponseError do |exception|
      logger.error("ERROR: Invalid response from #{controller_name} API query: #{exception.response}")
      render_error
    end

    rescue_from JSON::ParserError do |exception|
      logger.error("ERROR: Unable to parse non-JSON response from #{controller_name} API query")
      render_error
    end

    rescue_from Timeout::Error, EOFError do |exception|
      logger.error("ERROR: Failed to receive response from #{controller_name} API query")
      render_error
    end
  end

  class << self
    # [String] Key to access the federated search's API, set in config/federated_search.yml
    attr_accessor :api_key

    # [String] URL to which API queries are sent
    attr_accessor :api_url
  end

  ##
  # Search action for a federated search.
  #
  # Sub-classes should route to the overriden method for their searches, and
  # call +super+ before the method end.
  #
  def search
    @query    = params[:q]
    @term     = params[:term] ? CGI::unescape(params[:term]) : nil
    response = search_api
#    logger.debug("Query Params: #{request.query_parameters}")
    @results  = response["results"]
    @facets   = response["facets"]

    cache_search_facets(controller_name, @facets)
    preserve_params_facets(controller_name, @facets)

    respond_to do |format|
      format.html { render :template => 'search/page' }
      format.json { render :json => format_results_as_json }
    end
  end

  def explore
    search
  end

  def show
    response  = get_record_from_api
    @record   = edm_record_from_response(response)
    # @bing_access_token = RunCoCo::BingTranslator.get_bing_access_token()
    @bing_access_token = { :status => 'not yet implemented' }

    respond_to do |format|
      format.html { render :template => 'search/record' }
      format.json { render :json => response.to_json }
    end
  end

  def count_all
    load_api_key
    response = query_api(search_url, search_params)
    total_entries_from_response(response)
  rescue JSON::ParserError, Timeout::Error
    nil
  end

protected

  ##
  # Gets common search parameters with default values
  #
  def params_with_defaults
    count = [ (params[:count] || 12).to_i, 100 ].min # Default 12, max 100
    count = 12 unless count > 0

    page = (params[:page] || 1).to_i
    page = 1 unless page > 0

    @params_with_defaults ||= {
      :page   => page,
      :count  => count,
      :qf     => params[:qf] || {}
    }
  end

  ##
  # Gets the parameters to send to the federated search API
  #
  # When sub-classing, the returned +Hash+ should include the API key, query
  # terms, pagination settings, request for facets, and any other variables
  # required by the API.
  #
  # @return [Hash] Query parameters to send to the API
  #
  def search_params
    {}
  end

  ##
  # Gets the parameters for retrieval of an individual record from the API
  #
  # @return [Hash] Query parameters to send to the API
  # @raise [NotImplementedError] if not implemented by sub-class
  #
  def record_params
    raise NotImplementedError, "#record_params not implemented in #{self.class.name}"
  end

  ##
  # Gets the authentication params required by the API.
  #
  # Subclasses should implement this and return the params as a hash.
  #
  def authentication_params
    raise NotImplementedError, "#authentication_params not implemented in #{self.class.name}"
  end

  ##
  # Validates response from API
  #
  # Sub-classes should implement this and raise a ResponseError if the response
  # from their respective API is invalid, i.e. does not contain results in the
  # expected format.
  #
  # @raise [ResponseError] if the response is invalid
  #
  def validate_response!(response)
    raise ResponseError.new(response) if response.nil?
  end

private

  def render_error
    @status = "federated_search_error"
    render :template => '/pages/error', :status => 500
  end

  ##
  # Sends the query to the API.
  #
  # @param [String] url URL to send the query to. If nil, uses controller's
  #   +api_url+
  # @param [Hash,String] params URL query parameters.
  # @return [Hash] Response received from the API, parsed from JSON.
  #
  def query_api(url, params)
    url = construct_query_url(url, params)
    logger.debug("#{controller_name} API URL: #{url.to_s}")

    cache_key = "search/federated/#{controller_name}/" + Digest::MD5.hexdigest(url.to_s)
    if fragment_exist?(cache_key)
      response = YAML::load(read_fragment(cache_key))
      validate_response!(response)
    else
      response = JSON.parse(Net::HTTP.get(url))
      validate_response!(response)
      write_fragment(cache_key, response.to_yaml, :expires_in => 1.day)
    end

    response
  end

  # @return [Hash] Normalized API response, with keys "results" and "facets"
  def search_api
    response = query_api(search_url, search_params)

    edm_results = edm_results_from_response(response)
    results = paginate_search_results(edm_results, params_with_defaults[:page], params_with_defaults[:count], total_entries_from_response(response))
    facets = facets_from_response(response)

    { "results" => results, "facets" => facets }
  end

  # @return (see #query_api)
  def get_record_from_api
    query_api(record_url, record_params)
  end

  ##
  # Tests whether the federated search is configured.
  #
  # API keys should be set in config/federated_search.yml
  #
  # @raise [RuntimeError] if the federated search is not configured
  #
  def configured?
    if configuration_required?
      raise RuntimeError, "Federated search \"#{controller_name}\" not configured." unless self.class.api_key.present?
    end
  end

  ##
  # Returns +true+ if the API requires configuration
  #
  # Overload this if a particular API does not require configuration
  #
  # @return [Boolean]
  #
  def configuration_required?
    true
  end

  ##
  # Formats the results as JSON based on Europeana API search response.
  #
  # Expects the following instance variables to be set:
  # * +@query+    => Query string entered by the user
  # * +@results+  => Paginated search results
  # * +@facets+   => Facets returned from the federated search
  #
  # @return [String] Formatted JSON response
  #
  def format_results_as_json
    json = {
      "success" => true,
      "itemsCount" => @results.size,
      "totalResults" => @results.total_entries,
      "items" => @results,
      "facets" => @facets,
      "params" => {
        "start" => @results.offset + 1,
        "query" => @query,
        "rows"  => @results.per_page
      }
    }.to_json

    jsonp = "#{params[:callback]}(#{json});" unless params[:callback].blank?

    jsonp || json
  end

  ##
  # Reads configuration for federated search APIs from config file
  #
  # @return [Hash] API keys for the active Rails env, keyed by controller/API name
  #
  def configuration
    path = File.join(::Rails.root, 'config', 'federated_search.yml')
    if File.exist?(path)
      File.open(path) do |file|
        processed = ERB.new(file.read).result
        YAML.load(processed)[Rails.env] || {}
      end
    else
      {}
    end
  end

  ##
  # Sets the API key class instance variable from the configuration file
  #
  def load_api_key
    self.class.api_key ||= configuration[controller_name]
  end

  def search_url
    self.class.api_url
  end

  ##
  # Constructs the URL for the API query
  #
  # @param [String] url URL to send the query to
  # @param [Hash,String] params Query parameters
  # @return [URI] URL to send the query to, with params
  #
  def construct_query_url(url, params)
    url ||= self.class.api_url
    url = URI.parse(url)
    url.query = params.is_a?(String) ? params : params.to_query
    url
  end

  ##
  # Paginates search results for use with +will_paginate+
  #
  # @param results Search results from the API
  # @param [Fixnum] page Page of results currently displayed
  # @param [Fixnum] per_page Number of results displayed per page
  # @param [Fixnum] total Total number of results for this query
  # @return [WillPaginate::Collection] Paginated search results
  #
  def paginate_search_results(results, page, per_page, total)
    WillPaginate::Collection.create(page, per_page, total) do |pager|
      if total == 0
        pager.replace([])
      else
        pager.replace(results)
      end
    end
  end
end
