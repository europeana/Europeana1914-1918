##
# Interface to DigitalNZ API.
#
# @see http://www.digitalnz.org/developers/api-docs-v3/
#
class FederatedSearch::DigitalnzController < FederatedSearchController
  self.api_url = "http://api.digitalnz.org/v3/records.json"
  
  def item_url
    "http://api.digitalnz.org/v3/records/#{params[:id]}.json?[request-parameters]"
  end
  
protected
  
  def authentication_params
    { :api_key => self.class.api_key }
  end
  
  def search_params
    search_params = { 
      :text => params[:q],
      :per_page => params_with_defaults[:count],
      :page => params_with_defaults[:page],
      "without[content_partner][]" => "Europeana",
      "or[subject]" => [ "Great War", "World War, 1914-1918" ],
      :facets => "category,display_collection,creator,placename,year,decade,century,language,content_partner,rights,collection"
    }
    
    params_with_defaults[:facets].each_pair do |name, value|
      search_params["and[#{name}]"] ||= []
      search_params["and[#{name}]"] << value
    end
    
    search_params.merge(authentication_params)
  end
  
  def validate_response!(response)
    raise ResponseError.new(response) if response.has_key?("errors") && response["errors"].present?
  end
  
  def total_entries_from_response(response)
    response["search"]["result_count"]
  end
  
  def edm_results_from_response(response)
    edm = []
    
    return edm unless response["search"]["results"].present?
    
    response["search"]["results"].each do |item|
      edm_result = {
        "id" => item["id"],
        "title" => [ item["title"] ],
        "guid" => "http://www.digitalnz.org/records/" + item["id"].to_s,
        "provider" => [ "DigitalNZ" ],
        "dcCreator" => [ item["credit_creator"] ],
        "edmPreview" => [ item["thumbnail_url"] ]
      }
      
      edm << edm_result
    end
    
    edm
  end
  
  def facets_from_response(response)
    response["search"]["facets"].collect { |facet_name, facet_data|
      {
        "name" => facet_name,
        "label" => facet_name,
        "fields" => facet_data.collect { |field_name, field_count|
          {
            "label" => field_name,
            "search" => field_name,
            "count" => field_count
          }
        }
      }
    }
  end
  
end
