##
# Interface to Trove API.
#
# @see http://trove.nla.gov.au/general/api-technical
#
class TroveController < ApplicationController
  before_filter :trove_api_configured?

  # GET /trove/search
  # @todo Expose zone as a facet
  def search
    @results = []
    @query = params[:q]
    
    if @query.present?
      query_params = { 
        :page => (params[:page] || 1).to_i,
        :count => [ (params[:count] || 48).to_i, 100 ].min, # Default 48, max 100
        :zone => "picture"
      }
      response = api_search(@query, query_params)
      zone_results = response["response"]["zone"].select { |zone| zone["name"] == query_params[:zone] }.first
      edm_results = results_to_edm(zone_results)
      @results = paginate_search_result_items(zone_results, query_params)
    end
    
    render :template => 'search/page'
  end
  
protected
  
  def api_search(terms, options = {})
    query_options = { 
      :q => "subject(World War, 1914-1918) #{terms}", 
      :key => TROVE_API_KEY, 
      :zone => options[:zone],
      :encoding => "json",
      :n => options[:count],
      :s => ((options[:page] - 1) * options[:count])
    }
    
    logger.debug("Trove query: #{query_options[:q]}")
    
    uri = URI.parse("http://api.trove.nla.gov.au/result")
    uri.query = query_options.to_query
    JSON.parse(Net::HTTP.get(uri))
  end
  
  def results_to_edm(results)
    results["records"]["edm"] = []
    return unless results["records"]["work"].present?
    
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

end

