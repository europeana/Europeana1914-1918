##
# Interface to Trove API.
#
# @see http://trove.nla.gov.au/general/api-technical
#
class FederatedSearch::TroveController < FederatedSearchController
  self.api_url = "http://api.trove.nla.gov.au/result"
  
  def record_url
    "http://api.trove.nla.gov.au/work/#{params[:id]}"
  end
  
protected

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

  def params_with_defaults
    unless @params_with_defaults
      super
      @params_with_defaults.merge!({ 
        :zone => params[:facets][:zone],
        :facets => params[:facets].reject { |k, v| k == :zone }
      })
    end
    @params_with_defaults
  end

  def authentication_params
    { :key => self.class.api_key }
  end

  def search_params
    search_params = { 
      :q => "subject(World War, 1914-1918) #{params[:q]}",
      :zone => params_with_defaults[:zone],
      :encoding => "json",
      :n => params_with_defaults[:count],
      :s => ((params_with_defaults[:page] - 1) * params_with_defaults[:count]),
      :facet => "all"
    }.merge(authentication_params)
    
    params_with_defaults[:facets].each_pair do |name, value|
      search_params["l-#{name}"] = value
    end
    
    search_params
  end
  
  def record_params
    { 
      :encoding => "json",
      :reclevel => "full"
    }.merge(authentication_params)
  end
  
  def total_entries_from_response(response)
    zone_results(response)["records"]["total"].to_i
  end
  
  def edm_results_from_response(response)
    zone_results = zone_results(response)
  
    edm = []
    return edm unless zone_results["records"]["work"].present?
    
    zone_results["records"]["work"].each do |result|
      edm_result = {
        "id" => result["id"],
        "title" => [ result["title"] ],
        "guid" => show_trove_path(result["id"]),
        "provider" => [ "Trove" ],
        "year" => [ result["issued"] ],
        "dcCreator" => result["contributor"]
      }
      
      if result.has_key?("identifier")
        if thumbnail = result["identifier"].select { |id| id["linktype"] == "thumbnail" }.first
          edm_result["edmPreview"] = [ thumbnail["value"] ]
        end
      end
      
      edm << edm_result
    end
    
    edm
  end
  
  def facets_from_response(response)
    ([ zone_facet ] + zone_results(response)["facets"]["facet"]).collect { |facet|
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
  end
  
  def edm_record_from_response(response)
    edm = {}
    
    return edm unless response["work"].present?
    record = response["work"]
    
    edm["title"] = [ record["title"] ]
    
    edm["proxies"] = [ {
      "dcContributor" => { "def" => record["contributor"] },
      "dcDate"        => { "def" => [ record["issued"] ] },
      "dcDescription" => { "def" => record["abstract"] },
      "dcIdentifier"  => { "def" => [ record["id"] ].flatten },
      "dcLanguage"    => { "def" => record["language"] },
      "dcSubject"     => { "def" => [ record["subject"] ].flatten },
      "dcTitle"       => { "def" => [ record["title"] ] },
      "dcType"        => { "def" => record["type"] },
    } ]
    
    edm["aggregations"] = [ { 
      "edmDataProvider" => { "def" => [ "Trove" ] },
      "edmIsShownAt"    => record["troveUrl"],
      "edmObject"       => record["identifier"].select { |i| i["linktype"] == "thumbnail" }.first["value"],
    } ]
    
    edm
  end
  
private
  
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
  
  def zone_results(response)
    zone_results = response["response"]["zone"].select { |zone| zone["name"] == params_with_defaults[:zone] }.first
  end
  
end

