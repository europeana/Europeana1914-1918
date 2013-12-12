##
# Interface to Trove API.
#
# @see http://trove.nla.gov.au/general/api-technical
#
class FederatedSearch::TroveController < FederatedSearchController
  FACETS_I18N = {
    "zone" => "type",
    "format" => "format"
  }
  self.api_url = "http://api.trove.nla.gov.au/result"
  
  def record_url
    "http://api.trove.nla.gov.au/work/#{params[:id]}"
  end
  
protected

  def redirect_to_search
    zone = extracted_facet_params[:zone]

    # Validate zone:
    # * is present
    # * has only one value
    # * is a known value
    unless zone.present? && (zone.size == 1) && [ "article", "book", "collection", "map", "music", "picture" ].include?(zone.first)
      facet_params = extracted_facet_params
      facet_params[:zone] = [ "picture" ]
      params[:qf] = compile_facet_params(facet_params)
      @redirect_required = true
    end
    
    if params[:provider] && params[:provider] != self.controller_name
      params.delete(:zone)
    end
    
    super
  end

  def authentication_params
    { :key => self.class.api_key }
  end
  
  # @return [String]
  def search_params
    search_params = { 
      :q => "subject(World War, 1914-1918) #{params[:q]}",
      :zone => extracted_facet_params[:zone].first,
      :encoding => "json",
      :n => params_with_defaults[:count],
      :s => ((params_with_defaults[:page] - 1) * params_with_defaults[:count]),
      :facet => "format,availability,year,discipline"
    }.merge(authentication_params)
    
    
    facet_params = extracted_facet_params.dup
    facet_params.delete(:zone)
    facet_params = facet_params.collect do |name, criteria|
      criteria.collect { |criterion| criterion.to_query("l-#{name}") }
    end.flatten
    
    ([ search_params.to_query ] + facet_params).join("&")
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
        "guid" => show_trove_url(result["id"]),
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
    results = zone_results(response)
    facets = [ zone_facet ]
    if results["facets"] && results["facets"]["facet"]
      facets = facets + results["facets"]["facet"]
    end
    facets.collect { |facet|
      {
        "name" => facet["name"],
        "label" => t("views.search.facets.trove." + facet["name"], :default => [ ( "views.search.facets.common." + (FACETS_I18N[facet["name"]] || facet["name"]) ).to_sym, facet["displayname"] ]),
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
        { "search" => "newspaper", "display" => "Newspaper" },
      ]
    }
  end
  
  def zone_results(response)
    zone_results = response["response"]["zone"].select { |zone| zone["name"] == extracted_facet_params[:zone].first }.first
  end
  
end

