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
    if params[:newspaper] == '1'
      "http://api.trove.nla.gov.au/newspaper/#{params[:id]}"
    else
      "http://api.trove.nla.gov.au/work/#{params[:id]}"
    end
  end
  
  def show
    super
  rescue JSON::ParserError => exception
    if exception.message.match(/<title>Error 404 Not Found<\/title>/m)
      raise RecordNotFoundError.new(params[:id])
    else
      raise
    end
  end
  
protected

  def redirect_to_search
    return if performed?
  
    zone = extracted_facet_params[:zone]

    # Validate zone:
    # * is present
    # * has only one value
    # * is a known value
    unless zone.present? && [ "article", "book", "collection", "map", "music", "picture", "newspaper" ].include?(zone)
      facet_params = extracted_facet_params
      facet_params[:zone] = "picture"
      params[:qf] = facet_params
      @redirect_required = true
    end
    
    super
  end

  def authentication_params
    { :key => self.class.api_key }
  end
  
  # @return [String]
  def search_params
    facet_params = extracted_facet_params.dup
    
    query_terms = [ 
      @query, @term, facet_params.delete(:q),
      '("first world war" OR "world war i" OR "world war, 1914-1918")'
    ].reject(&:blank?)
  
    search_params = { 
      :q => query_terms.join(' AND '),
      :zone => extracted_facet_params[:zone],
      :encoding => "json",
      :n => params_with_defaults[:count],
      :s => ((params_with_defaults[:page] - 1) * params_with_defaults[:count]),
      :facet => "format,availability,year,discipline"
    }.merge(authentication_params)
    
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
    response['response']['zone'].collect { |zone| zone['records']['total'].to_i }.sum
  end
  
  def edm_results_from_response(response)
    zone_results = zone_results(response)
    newspaper_zone = (extracted_facet_params[:zone] == "newspaper")
    records_key = (newspaper_zone ? "article" : "work")
    records = zone_results["records"][records_key]
    
    edm = []
    return edm unless records.present?
    
    records.each do |result|
      edm_result = {
        "id" => result["id"],
        "title" => [ newspaper_zone ? result["heading"] : result["title"] ],
        "guid" => show_trove_url(result["id"], newspaper_zone ? { :newspaper => '1' } : {}),
        "provider" => [ "Trove" ],
        "year" => [ newspaper_zone ? result["date"] : result["issued"] ],
        "dcCreator" => newspaper_zone ? [ result["title"]["value"] ] : result["contributor"]
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
      facets = facets + [ results["facets"]["facet"] ].flatten
    end
    facets.collect { |facet|
      {
        "name" => facet["name"].to_s,
        "label" => t("views.search.facets.trove." + facet["name"], :default => [ ( "views.search.facets.common." + (FACETS_I18N[facet["name"]] || facet["name"]) ).to_sym, facet["displayname"] ]),
        "fields" => facet["term"].collect { |row|
          {
            "label" => row["display"].to_s,
            "search" => row["search"].to_s,
            "count" => row["count"]
          }
        }
      }
    }
  end
  
  def edm_record_from_response(response)
    edm = {}
    
    newspaper_zone = (params[:newspaper] == '1')
    response_key = (newspaper_zone ? "article" : "work")
    record = response[response_key]
    
    return edm unless record.present?
    
    edm["title"] = [ newspaper_zone ? record["heading"] : record["title"] ]
    
    edm["proxies"] = [ {
      "dcCreator"     => { "def" => newspaper_zone ? [ record["title"]["value"] ] : record["contributor"] },
      "dcDate"        => { "def" => [ newspaper_zone ? record["date"] : record["issued"] ], },
      "dcDescription" => { "def" => record["abstract"] },
      "dcIdentifier"  => { "def" => [ record["id"] ].flatten },
      "dcLanguage"    => { "def" => record["language"] },
      "dcSubject"     => { "def" => [ record["subject"] ].flatten },
      "dcTitle"       => { "def" => [ newspaper_zone ? record["heading"] : record["title"] ] },
      "dcType"        => { "def" => record["type"] },
    } ]
    
    thumbnail = (!newspaper_zone && record["identifier"].present?) ? record["identifier"].select { |i| i["linktype"] == "thumbnail" }.first : nil
    
    edm["aggregations"] = [ { 
      "edmProvider"     => { "def" => [ "Trove" ] },
      "edmIsShownAt"    => record["troveUrl"],
      "edmObject"       => thumbnail.present? ? thumbnail["value"] : nil,
    } ]
    
    edm["europeanaAggregation"] = {
      "edmPreview" => thumbnail.present? ? thumbnail["value"] : nil
    }
    
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
    zone_results = response["response"]["zone"].select { |zone| zone["name"] == extracted_facet_params[:zone] }.first
  end
  
end

