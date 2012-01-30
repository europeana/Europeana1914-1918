module MetadataFieldsHelper
  ##
  # Gets a collection of taxonomy terms for the given metadata field
  #
  # Suitable for use with Formtastic select fields.
  def metadata_field_taxonomy_terms(metadata_field)
    case metadata_field.field_type
    when 'taxonomy'
      metadata_field.taxonomy_terms
    else
      nil
    end
  end
  
  def metadata_field_hint(field)
    t("formtastic.hints.metadata_record.#{field.name}", :default => '')
  end
  
  def metadata_field_label(field)
    t("formtastic.labels.metadata_record.#{field.name}", :default => '')
  end
end
