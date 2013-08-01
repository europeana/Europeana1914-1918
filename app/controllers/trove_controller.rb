##
# Interface to Trove API.
#
# @see http://trove.nla.gov.au/general/api-technical
#
class TroveController < ApplicationController
  before_filter :trove_api_configured?
  before_filter :redirect_to_search, :only => :search

  # GET /trove/search
  def search
    @results = []
    @query = params[:q]
    
    query_params = { 
      :page => (params[:page] || 1).to_i,
      :count => [ (params[:count] || 48).to_i, 100 ].min, # Default 48, max 100
      :zone => params[:facets][:zone],
      :facets => params[:facets].reject { |k, v| k == :zone }
    }
    response = api_search(@query, query_params)
    zone_results = response["response"]["zone"].select { |zone| zone["name"] == query_params[:zone] }.first
    edm_results = results_to_edm(zone_results)
    @results = paginate_search_result_items(edm_results, query_params)
    @facets = [ zone_facet ] + zone_results["facets"]["facet"]
    
    render :template => 'search/page'
  end
  
protected

  ##
  # Constructs a pseudo-facet for Trove's search zones
  #
  # @return [Hash]
  #
  def zone_facet
    {
      "name" => "zone",
      "displayname" => "Zone",
      "term" => [ 
        { "search" => "article", "display" => "Article" },
        { "search" => "book", "display" => "Book" },
        { "search" => "collection", "display" => "Collection" },
        { "search" => "map", "display" => "Map" },
        { "search" => "music", "display" => "Music" },
        { "search" => "picture", "display" => "Picture" },
      ]
    }
  end
  
  # @todo Handle API errors, e.g. zone not supplied, key invalid
  def api_search(terms, options = {})
    query_options = { 
      :q => "subject(World War, 1914-1918) #{terms}", 
      :key => TROVE_API_KEY, 
      :zone => options[:zone],
      :encoding => "json",
      :n => options[:count],
      :s => ((options[:page] - 1) * options[:count]),
      :facet => "all"
    }
    
    options[:facets].each_pair do |name, value|
      query_options["l-#{name}"] = value
    end
    
    logger.debug("Trove query: #{query_options[:q]}")
    
    uri = URI.parse("http://api.trove.nla.gov.au/result")
    uri.query = query_options.to_query
    logger.debug("Trove API URI: #{uri.to_s}")
    JSON.parse(Net::HTTP.get(uri))
  end
  
  def results_to_edm(results)
    results["records"]["edm"] = []
    return results unless results["records"]["work"].present?
    
    results["records"]["work"].each do |result|
      edm_result = {
        "id" => result["id"],
        "title" => [ result["title"] ],
        "guid" => result["troveUrl"],
        "provider" => [ "Trove" ],
        "year" => [ result["issued"] ],
        "dcCreator" => result["contributor"]
      }
      
      if result.has_key?("identifier")
        if thumbnail = result["identifier"].select { |id| id["linktype"] == "thumbnail" }.first
          edm_result["edmPreview"] = [ thumbnail["value"] ]
        end
      end
      
      results["records"]["edm"] << edm_result
    end
    results
  end
  
  def paginate_search_result_items(response, options)
    WillPaginate::Collection.create(options[:page], options[:count], response["records"]["total"].to_i) do |pager|
      if response["records"]["total"].to_i == 0
        pager.replace([])
      else
        pager.replace(response["records"]["edm"])
      end
    end
  end
  
  def trove_api_configured?
    raise RuntimeError, "Trove API not configured." unless defined?(TROVE_API_KEY) == "constant" && TROVE_API_KEY.present?
  end

  def redirect_to_search
    unless params[:facets] && params[:facets][:zone]
      params[:facets] ||= {}
      params[:facets][:zone] = "picture"
      redirect_required = true
    end
    
    # Validate zone against permitted values
    unless [ "article", "book", "collection", "map", "music", "picture" ].include?(params[:facets][:zone])
      params[:facets][:zone] = "picture"
      redirect_required = true
    end
    
    if params[:provider] && params[:provider] != self.controller_name
      params.delete(:facets)
      params[:controller] = params[:provider]
      redirect_required = true
    elsif params[:facets]
      params[:facets].each_key do |facet_name|
        if params[:facets][facet_name].is_a?(Array)
          params[:facets][facet_name] = params[:facets][facet_name].collect { |row| row.to_s }.join(",")
          redirect_required = true
        end
      end
    end
    
    params.delete(:provider)
    
    redirect_to params if redirect_required
  end
  
end

