module SearchHelper
  def facet_label(facet_name, type = nil)
    if taxonomy_field_facet = facet_name.to_s.match(/^metadata_(.+)_ids$/)
      field_name = taxonomy_field_facet[1]
      metadata_field_label(field_name, type)
    else
      facet_name
    end
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
end
