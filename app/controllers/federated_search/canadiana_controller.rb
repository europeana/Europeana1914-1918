##
# Interface to Canadiana API.
#
# @see http://search.canadiana.ca/support/api
#
class FederatedSearch::CanadianaController < FederatedSearchController
  self.api_url = "http://search.canadiana.ca/search"
  
protected
  
  # @return [String]
  def search_params
    search_params = { 
      :q    => params[:q],
      :fmt  => 'json',
      :su   => '"World War, 1914-1918"'
    }
    
    facet_params = extracted_facet_params.collect do |name, criteria|
      [ criteria ].flatten.collect { |criterion| criterion.to_query(name) }
    end.flatten
    
    ([ search_params.to_query ] + facet_params).join("&")
  end
  
  def search_url
    self.class.api_url + "/" + params_with_defaults[:page].to_s
  end

  def total_entries_from_response(response)
    response["hits"]
  end
  
  def edm_results_from_response(response)
    edm = []
    
    return edm unless response["docs"].present?
    
    response["docs"].each do |item|
      edm_result = {
        "id"          => item["key"],
        "title"       => item["title"],
        "guid"        => item["location"],
        "provider"    => item["source"],
        "dcCreator"   => item["creator"]
      }
      
      edm << edm_result
    end
    
    edm
  end
  
  def facets_from_response(response)
    response["facet"].collect { |facet_name, facet_data|
      {
        "name" => facet_name,
        "label" => facet_name,
        "fields" => facet_data.each_slice(2).collect { |field_data|
          {
            "label" => field_data.first,
            "search" => field_data.first,
            "count" => field_data.last
          }
        }
      }
    }
  end

private

  def configuration_required?
    false
  end
end
