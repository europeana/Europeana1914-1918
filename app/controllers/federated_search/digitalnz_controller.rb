##
# Interface to DigitalNZ API.
#
# @see http://www.digitalnz.org/developers/api-docs-v3/
#
class FederatedSearch::DigitalnzController < FederatedSearchController
  self.api_url = "http://api.digitalnz.org/v3/records.json"
  
protected
  
  def query_api(terms)
    options = query_params
    
    query_options = { 
      :text => terms,
      :api_key => self.class.api_key,
      :per_page => options[:count],
      :page => options[:page],
      "without[content_partner][]" => "Europeana",
      "or[subject]" => [ "Great War", "World War, 1914-1918" ],
      :facets => "category,display_collection,creator,placename,year,decade,century,language,content_partner,rights,collection"
    }
    
    options[:facets].each_pair do |name, value|
      query_options["and[#{name}]"] ||= []
      query_options["and[#{name}]"] << value
    end
    
    url = construct_query_url(query_options)
    
    logger.debug("DigitalNZ query: #{query_options[:text]}")
    logger.debug("DigitalNZ API URL: #{url.to_s}")

    response = JSON.parse(Net::HTTP.get(url))
    edm_results = edm_results_from_response(response)
    results = paginate_search_results(edm_results, options[:page], options[:count], response["search"]["result_count"])
    
    facets = facets_from_response(response)
    
    { "results" => results, "facets" => facets }
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
    facets_with_rows = response["search"]["facets"].reject { |facet_name, facet_data| facet_data.blank? }
    
    facets_with_rows.collect { |facet_name, facet_data|
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
