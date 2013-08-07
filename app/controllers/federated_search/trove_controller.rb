##
# Interface to Trove API.
#
# @see http://trove.nla.gov.au/general/api-technical
#
class FederatedSearch::TroveController < FederatedSearchController
  
  
protected

  def query_params
    unless @query_params
      super
      @query_params.merge!({ 
        :zone => params[:facets][:zone],
        :facets => params[:facets].reject { |k, v| k == :zone }
      })
    end
    @query_params
  end

  ##
  # Constructs a pseudo-facet for Trove's search zones
  #
  # @return [Hash]
  # @todo Move labels into locale
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
  def query_api(terms)
    options = query_params
    
    query_options = { 
      :q => "subject(World War, 1914-1918) #{terms}", 
      :key => api_key,
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

    response = JSON.parse(Net::HTTP.get(uri))
    
    zone_results = response["response"]["zone"].select { |zone| zone["name"] == query_params[:zone] }.first
    edm_results = results_to_edm(zone_results)
    results = paginate_search_results(edm_results["records"]["edm"], options[:page], options[:count], edm_results["records"]["total"].to_i)
    
    # Modelled on the structure of facets returned by Europeana API
    facets = ([ zone_facet ] + zone_results["facets"]["facet"]).collect { |facet|
      {
        "name" => facet["name"],
        "label" => facet["displayname"],
        "fields" => facet["term"].collect { |row|
          {
            "label" => row["display"],
            "search" => row["search"],
            "count" => row["count"]
          }
        }
      }
    }
    
    { "results" => results, "facets" => facets }
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
  
  def redirect_to_search
    # Ensure zone is always specified
    unless params[:facets] && params[:facets][:zone]
      params[:facets] ||= {}
      params[:facets][:zone] = "picture"
      @redirect_required = true
    end
    
    # Validate zone against permitted values
    unless [ "article", "book", "collection", "map", "music", "picture" ].include?(params[:facets][:zone])
      params[:facets][:zone] = "picture"
      @redirect_required = true
    end
    
    super
  end
  
end

