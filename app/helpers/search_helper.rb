module SearchHelper
  def facet_label(facet_name, type = nil)
    if taxonomy_field_facet = facet_name.to_s.match(/^metadata_(.+)_ids$/)
      field_name = taxonomy_field_facet[1]
      metadata_field_label(field_name, type)
    end
  end
end
