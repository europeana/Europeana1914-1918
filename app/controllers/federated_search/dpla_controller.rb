##
# Interface to DPLA API.
#
# @see http://dp.la/info/developers/
#
class FederatedSearch::DplaController < FederatedSearchController
  self.api_url = "http://api.dp.la/v2/items"
  
  def record_url
    self.class.api_url + "/#{params[:id]}"
  end
  
protected

  def authentication_params
    { :api_key => self.class.api_key }
  end

  def search_params
    search_params = { 
      :q => params[:q],
      "sourceResource.subject.name" => '"World War, 1914-1918"',
      :page_size => params_with_defaults[:count],
      :page => params_with_defaults[:page],
      :facets => "sourceResource.contributor,sourceResource.date.begin,sourceResource.date.end,sourceResource.language.name,sourceResource.language.iso639,sourceResource.format,sourceResource.stateLocatedIn.name,sourceResource.stateLocatedIn.iso3166-2,sourceResource.spatial.name,sourceResource.spatial.country,sourceResource.spatial.region,sourceResource.spatial.county,sourceResource.spatial.state,sourceResource.spatial.city,sourceResource.spatial.iso3166-2,sourceResource.subject.@id,sourceResource.subject.name,sourceResource.temporal.begin,sourceResource.temporal.end,sourceResource.type,hasView.@id,hasView.format,isPartOf.@id,isPartOf.name,provider.@id,provider.name"
    }.merge(authentication_params)
    
    params_with_defaults[:facets].each_pair do |name, value|
      if name == "sourceResource.subject.name"
        search_params[name] = search_params[name] + " " + value
      else
        search_params[name] = value
      end
    end
    
    search_params
  end
  
  def record_params
    authentication_params
  end
  
  def validate_response!(response)
    raise ResponseError.new(response) if response["message"] == "Internal Server Error"
  end
  
  def total_entries_from_response(response)
    response["count"]
  end
  
  def edm_results_from_response(response)
    edm = []
    
    return edm unless response["docs"].present?
    
    response["docs"].each do |item|
      edm_result = {
        "id" => item["id"],
        "title" => [ item["sourceResource"]["title"] ],
        "guid" => show_digitalnz_path(item["id"]),
        "provider" => [ "DPLA" ],
        "dcCreator" => [ item["sourceResource"]["creator"] ],
        "edmPreview" => [ item["object"] ]
      }
      
      if item["sourceResource"].has_key?("date")
        edm_result["year"] = [ item["sourceResource"]["date"]["begin"], item["sourceResource"]["date"]["end"] ].uniq
      end
      
      edm << edm_result
    end
    
    edm
  end
  
  def facets_from_response(response)
    response["facets"].collect do |facet_name, facet_data|
      facet = {
        "name" => facet_name,
        "label" => facet_name
      }
      facet["fields"] = case facet_data["_type"]
      when "terms"
        facet_terms = facet_data["terms"]
        facet_terms.reject! { |row| row["term"] == "World War, 1914-1918" } if facet_name == "sourceResource.subject.name"
        facet_terms.collect { |row|
          {
            "label" => row["term"],
            "search" => row["term"],
            "count" => row["count"]
          }
        }
      when "date_histogram"
        facet_data["entries"].collect { |row|
          {
            "label" => row["time"],
            "search" => row["time"],
            "count" => row["count"]
          }
        }
      end
      facet
    end
  end
  
  def edm_record_from_response(response)
    edm = {}
    
    return edm unless response["docs"].present?
    record = response["docs"].first
    
    edm["title"] = record["sourceResource"]["title"]
    
    edm["proxies"] = [ {
      "dcCreator"     => { "def" => record["sourceResource"]["creator"] },
      "dcDate"        => { "def" => [ record["sourceResource"]["date"]["displayDate"] ] },
      "dcDescription" => { "def" => record["sourceResource"]["description"] },
      "dcExtent"      => { "def" => [ record["sourceResource"]["extent"] ] },
      "dcFormat"      => { "def" => [ record["sourceResource"]["format"] ] },
      "dcIdentifier"  => { "def" => [ record["id"] ] },
      "dcLanguage"    => record["sourceResource"]["language"].present? ? 
        { "def" => record["sourceResource"]["language"].collect { |language| language["name"] } } :
        nil,
      "dcPublisher"   => { "def" => record["sourceResource"]["publisher"] },
      "dcRights"      => { "def" => [ record["sourceResource"]["rights"] ] },
      "dcSubject"     => record["sourceResource"]["subject"].present? ? 
        { "def" => record["sourceResource"]["subject"].collect { |subject| subject["name"] } }
        : nil,
      "dcTitle"       => { "def" => [ record["sourceResource"]["title"] ].flatten },
      "dcType"        => { "def" => [ record["sourceResource"]["specType"] ] },
    } ]
    
    edm["aggregations"] = [ {
      "edmDataProvider" => { "def" => [ record["dataProvider"] ].flatten },
      "edmIsShownAt"    => record["isShownAt"],
      "edmObject"       => record["hasView"].present? ? record["hasView"].first["url"] : record["object"],
      "edmProvider"     => { "def" => [ record["provider"]["name"] ] },
    } ]
    
    if record["sourceResource"]["spatial"].present?
      if record["sourceResource"]["spatial"]["coordinates"].present?
        lat, lng = record["sourceResource"]["spatial"]["coordinates"].split(",")
        edm["places"] = [ {
          "latitude" => lat.strip,
          "longitude" => lng.strip
        } ]
      end
      edm["aggregations"]["edmCountry"] = record["sourceResource"]["spatial"]["country"]
    end
    
    edm
  end

end
