##
# Abstract controller for federated searches.
#
class FederatedSearchController < ApplicationController
  before_filter :load_configuration
  before_filter :federated_search_configured?
  before_filter :redirect_to_search, :only => :search
  
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
    @query = params[:q]
    
    response = query_api(@query)
    @results = response["results"]
    @facets = response["facets"]
    
    respond_to do |format|
      format.html { render :template => 'search/page' }
      format.json { render :json => format_results_as_json }
    end
  end
  
protected
  ##
  # Sends the query to the API.
  #
  # Specifics to be implemented by sub-classes.
  #
  # @param [String] terms Text to search for
  # @return [Hash] Normalized API response, with keys "results" and "facets"
  #
  def query_api(terms)
    { "results" => [], "facets" => [] }
  end

  def query_params
    @query_params ||= { 
      :page => (params[:page] || 1).to_i,
      :count => [ (params[:count] || 48).to_i, 100 ].min, # Default 48, max 100
      :facets => params[:facets] || {}
    }
  end

  ##
  # Tests whether the federated search is configured.
  #
  # API keys should be set in config/federated_search.yml
  #
  # @raise [RuntimeError] if the federated search is not configured
  #
  def federated_search_configured?
    raise RuntimeError, "Federated search \"#{controller_name}\" not configured." unless self.class.api_key.present?
  end
  
  ##
  # Handles redirects to sanitize parameters.
  #
  # Sub-classes should:
  # * override this method
  # * alter the +params+ Hash as necessary
  # * perform their own tests for required redirects
  # * set +@redirect_required+ to +true+ if a redirect is required
  # * call +super+
  #
  def redirect_to_search
    if params[:provider] && params[:provider] != self.controller_name
      params.delete(:facets)
      params[:controller] = params[:provider]
      @redirect_required = true
    elsif params[:facets]
      params[:facets].each_key do |facet_name|
        if params[:facets][facet_name].is_a?(Array)
          params[:facets][facet_name] = params[:facets][facet_name].collect { |row| row.to_s }.join(",")
          @redirect_required = true
        end
      end
    end
    
    params.delete(:provider)
    
    redirect_to params if @redirect_required
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
  
  def load_configuration
    self.class.api_key ||= configuration[controller_name]
  end
  
  def construct_query_url(params)
    url = URI.parse(self.class.api_url)
    url.query = params.to_query
    url
  end
  
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
