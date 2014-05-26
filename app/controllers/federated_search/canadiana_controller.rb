# encoding: utf-8

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
  
  FACET_LABELS = {
    'contributor' => {
      'otu'       => 'University of Toronto',
      'bvau'      => 'University of British Columbia',
      'alouette'  => 'Alouette Canada',
      'oocihm'    => 'Canadiana.org',
      'otp'       => 'Toronto Public Library',
      'manitobia' => 'Manitobia',
      'aeu'       => 'University of Alberta',
      'bva'       => 'Vancouver Public Library',
      'mun'       => 'Memorial University of Newfoundland',
      'ooe'       => 'Foreign Affairs and International Trade Canada',
      'oong'      => 'National Gallery of Canada',
      'ac'        => 'Calgary Public Library',
      'nbfu'      => 'University of New Brunswick',
      'nsngp'     => 'Pictou-Antigonish Regional Library'
    },
    'lang' => {
      'eng' => 'English',
      'fra' => 'Français'
    }
  }
  
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
    facets = response["facet"].reject { |facet_name, facet_data| facet_name == 'collection' }
    facets.collect { |facet_name, facet_data|
      facet_label_key = facet_name == 'lang' ? 'language' : facet_name
      {
        "name" => facet_name,
        "label" => t("views.search.facets.common.#{facet_label_key}", :default => :"views.search.facets.canadiana.#{facet_label_key}"),
        "fields" => facet_data.each_slice(2).collect { |field_data|
          field_search = field_data.first
          field_label = if FACET_LABELS.has_key?(facet_name) && FACET_LABELS[facet_name].has_key?(field_search)
            FACET_LABELS[facet_name][field_search]
          else
            field_search
          end
          
          {
            "label" => field_label,
            "search" => field_search,
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
