##
# Interface to DPLA API.
#
# @see http://dp.la/info/developers/
#
class FederatedSearch::DplaController < FederatedSearchController
  FACETS_I18N = {
    "sourceResource.subject.name"   => "subject",
    "sourceResource.spatial.name"   => "location",
    "provider.name"                 => "provider",
    "sourceResource.language.name"  => "language",
    "sourceResource.type"           => "type"
  }

  self.api_url = "http://api.dp.la/v2/items"
  
  def record_url
    self.class.api_url + "/#{params[:id]}"
  end
  
protected

  def authentication_params
    { :api_key => self.class.api_key }
  end

  def search_params
    facet_params = extracted_facet_params.dup
    
    query_terms = [ 
      @query, @term, facet_params.delete(:q),
      '("world war, 1914-1918" OR "world war I" OR "great war")'
    ].reject(&:blank?)
    
    search_params = { 
      :q => query_terms.join(' AND '),
      :page_size => params_with_defaults[:count],
      :page => params_with_defaults[:page],
      :facets => "sourceResource.subject.name,sourceResource.spatial.name,provider.name,sourceResource.language.name,sourceResource.type"
    }.merge(authentication_params)
    
    facet_params.each_pair do |name, value|
      if FACETS_I18N.has_key?(name)
        search_params[name] = value.join(" ")
      end
    end
    
    search_params
  end
  
  def record_params
    authentication_params
  end
  
  def validate_response!(response)
    raise ResponseError.new(response) if response["message"] == "Internal Server Error"
    
    if response["docs"].present?
      record = response["docs"].first
      if record.has_key?("error")
        case record["error"]
        when "404"
          raise RecordNotFoundError
        else
          raise StandardError, record["error"]
        end
      end
    end
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
        "title" => [ item["sourceResource"]["title"] ].flatten,
        "guid" => show_dpla_url(item["id"]),
        "provider" => [ "DPLA" ],
        "dcCreator" => [ item["sourceResource"]["creator"] ].flatten,
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
    return [] unless response["facets"].present?
    response["facets"].collect do |facet_name, facet_data|
      facet = {
        "name" => facet_name,
        "label" => t(FACETS_I18N[facet_name], :scope => 'views.search.facets.common'),
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
      "dcDate"        => record["sourceResource"]["date"].present? ? 
        { "def" => [ record["sourceResource"]["date"]["displayDate"] ] } :
        nil,
      "dcDescription" => { "def" => [ record["sourceResource"]["description"] ] },
      "dcExtent"      => { "def" => [ record["sourceResource"]["extent"] ] },
      "dcFormat"      => { "def" => [ record["sourceResource"]["format"] ] },
      "dcIdentifier"  => { "def" => [ record["id"] ] },
      "dcLanguage"    => record["sourceResource"]["language"].present? ? 
        { "def" => record["sourceResource"]["language"].collect { |language| language["name"] } } :
        nil,
      "dcPublisher"   => { "def" => [ record["sourceResource"]["publisher"] ] },
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
      "edmObject"       => record["hasView"].present? ? [ record["hasView"] ].flatten.first["url"] : record["object"],
      "edmProvider"     => { "def" => [ record["provider"]["name"] ] },
    } ]
    
    if record["sourceResource"]["spatial"].present?
      edm["places"] = []
      edm["aggregations"].first["edmCountry"] = []
      [ record["sourceResource"]["spatial"] ].flatten.each do |spatial|
        if spatial["coordinates"].present?
          lat, lng = spatial["coordinates"].split(",")
          edm["places"] << {
            "latitude" => lat.strip,
            "longitude" => lng.strip
          }
        end
        edm["aggregations"].first["edmCountry"] << spatial["country"]
      end
    end
    
    has_view = [ record["hasView"] ].flatten.first
    edm_preview = if has_view.present? && has_view["url"].present?
      has_view["url"]
    else
      record["object"]
    end
    edm["europeanaAggregation"] = {
      "edmPreview" => edm_preview
    }
    
    edm
  end

end
