module SearchHelper
  def facet_label(facet_name, context = nil)
    if taxonomy_field_facet = facet_name.to_s.match(/^metadata_(.+)_ids$/)
      field_name = taxonomy_field_facet[1]
    else
      field_name = facet_name
    end
    
    t("views.search.facets.contributions.#{field_name}", :default => facet_name)
  end
  
  def link_to_facet_row(facet_name, row_value)
    @@metadata_fields ||= {}
    
    if row_value.is_a?(Integer)
      if taxonomy_field_facet = facet_name.to_s.match(/^metadata_(.+)_ids$/)
        field_name = taxonomy_field_facet[1]
        unless @@metadata_fields[field_name]
          @@metadata_fields[field_name] = MetadataField.includes(:taxonomy_terms).find_by_name(field_name)
        end
        if row_term = @@metadata_fields[field_name].taxonomy_terms.select { |term| term.id == row_value }.first
          row_label = row_term.term
        end
      end
    end
    
    row_label ||= row_value.to_s
    
    link_to row_label, request.query_parameters.merge(:page => 1, :facets => (request.query_parameters[:facets] || {}).merge({ facet_name => row_value }))
  end
  
  def link_to_search_provider(id)
    case id
    when 'contributions'
      text = "1914-1918"
    when 'europeana'
      text = "Europeana portal"
    else
      raise ArgumentError, "Unknown search provider: #{id.to_s}"
    end
    
    url_options = request.parameters.merge(:page => 1, :controller => id)
    url_options.delete(:facets)
    link_to text, url_options
  end
  
  def search_result_id(result)
    if result.respond_to?(:id)
      result.id
    elsif result.is_a?(Enumerable) && result.has_key?('id')
      result['id']
    else
      raise ArgumentError, "Unable to retrieve search result ID from #{result.class}"
    end
  end
  
  def search_result_to_edm(result)
    if result.respond_to?(:to_edm_result)
      result.to_edm_result
    elsif result.is_a?(Hash)
      result
    else
      raise ArgumentError, "Unable to convert search result to EDM: #{result.class}"
    end
  end
  
  def search_result_fragment_key(result)
    "#{session[:theme]}/#{I18n.locale}/search/result/#{controller.controller_name}/" + no_leading_slash(search_result_id(result).to_s)
  end
  
  def search_result_preview(record)
    if record['edmPreview'].blank? || record['edmPreview'].first.blank?
      if controller.controller_name == 'contributions'
        image_tag(contribution_media_type_image_path(record['id']), :alt => "")
      end
    else
      image_tag(record['edmPreview'].first, :alt => "")
    end
  end
end
