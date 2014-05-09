##
# Interface to Canadiana API.
#
# @see http://search.canadiana.ca/support/api
#
class FederatedSearch::CanadianaController < FederatedSearchController
  self.api_url = "http://search.canadiana.ca/search"
  
  def record_url
    "http://search.canadiana.ca/view/#{params[:id]}"
  end
  
protected
  
  # @return [String]
  def search_params
    facet_params = extracted_facet_params.dup
    
    query_terms = [ 
      @query, @term, facet_params.delete(:q)
    ].reject(&:blank?)
  
    search_params = { 
      :q    => query_terms.join(' AND '),
      :fmt  => 'json',
      :su   => '"World War, 1914-1918"'
    }
    
    facet_params = facet_params.collect do |name, criteria|
      [ criteria ].flatten.collect { |criterion| criterion.to_query(name) }
    end.flatten
    
    ([ search_params.to_query ] + facet_params).join("&")
  end
  
  def record_params
    {
      :fmt => 'json'
    }
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
        "guid"        => show_canadiana_url(item["key"]),
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
  
  def edm_record_from_response(response)
    edm = {}
    
    return edm unless response["doc"].present?
    doc = response["doc"]
    
    edm["title"] = doc["title"]
    
    edm["proxies"] = [ {
      "dcCreator"     => { "def" => doc["creator"] },
      "dcDescription" => { "def" => doc["abstract"] },
      "dcFormat"      => { "def" => doc["media"] },
      "dcIdentifier"  => { "def" => doc["key"] },
      "dcLanguage"    => { "def" => doc["lang"] },
      "dcPublisher"   => { "def" => doc["published"] },
      "dcSubject"     => { "def" => doc["subject"] },
      "dcTitle"       => { "def" => doc["title"] },
      "dcType"        => { "def" => doc["type"] },
    } ]
    
    edm["aggregations"] = [ { 
      "edmIsShownAt"    => doc["location"],
      "edmProvider"     => { "def" => [ "Canadiana" ] },
    } ]
    
    edm["europeanaAggregation"] = { }
    
    edm
  end

private

  def configuration_required?
    false
  end
end
