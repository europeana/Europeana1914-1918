##
# Interface to DPLA API.
#
# @see http://dp.la/info/developers/
#
class FederatedSearch::DplaController < FederatedSearchController
  self.api_url = "http://api.dp.la/v2/items"
  
protected

  def query_params
    query_params = { 
      :q => params[:q],
      :api_key => self.class.api_key,
      "sourceResource.subject.name" => '"World War, 1914-1918"',
      :page_size => params_with_defaults[:count],
      :page => params_with_defaults[:page],
      :facets => "sourceResource.contributor,sourceResource.date.begin,sourceResource.date.end,sourceResource.language.name,sourceResource.language.iso639,sourceResource.format,sourceResource.stateLocatedIn.name,sourceResource.stateLocatedIn.iso3166-2,sourceResource.spatial.name,sourceResource.spatial.country,sourceResource.spatial.region,sourceResource.spatial.county,sourceResource.spatial.state,sourceResource.spatial.city,sourceResource.spatial.iso3166-2,sourceResource.subject.@id,sourceResource.subject.name,sourceResource.temporal.begin,sourceResource.temporal.end,sourceResource.type,hasView.@id,hasView.format,isPartOf.@id,isPartOf.name,isShownAt,object,provider.@id,provider.name"
    }
    
    params_with_defaults[:facets].each_pair do |name, value|
      if name == "sourceResource.subject.name"
        query_params[name] = query_params[name] + " " + value
      else
        query_params[name] = value
      end
    end
    
    query_params
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
        "guid" => "http://dp.la/item/" + item["id"],
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
    facets_with_rows = response["facets"].reject { |facet_name, facet_data| facet_data["terms"].blank? && facet_data["entries"].blank? }
    
    facets_with_rows.collect do |facet_name, facet_data|
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

end