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
  
  def metadata_field_hint(field, type)
    key = case type
    when :contribution
      "formtastic.hints.contribution.metadata.#{field.name}"
    when :attachment
      "formtastic.hints.attachment.metadata.#{field.name}"
    else
      "formtastic.hints.metadata_record.#{field.name}"
    end
    
    field_hints = []
    if field.required?
      field_hints << content_tag('span', t('common.help_text.mandatory'), :class => "mandatory")
    end
    field_hints << t(key, :default => '')
    raw field_hints.join('<br />')
  end
  
  def metadata_field_label(field, type)
    key = case type
    when :contribution
      "formtastic.labels.contribution.metadata.#{field.name}"
    when :attachment
      "formtastic.labels.attachment.metadata.#{field.name}"
    else
      "formtastic.labels.metadata_record.#{field.name}"
    end
    t(key)
  end
end
