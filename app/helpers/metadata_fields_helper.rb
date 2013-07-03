module MetadataFieldsHelper
  ##
  # Gets a collection of taxonomy terms for the given metadata field
  #
  # Suitable for use with Formtastic select fields.
  #
  # @param [MetadataField,String] field_or_name Either a metadata field instance, or the name
  #   of the field.
  # @return [Array<TaxonomyTerm>] Array of the field's taxonomy terms.
  #
  def metadata_field_taxonomy_terms(field_or_name)
    case field_or_name
    when MetadataField
      field = field_or_name
    when String
      field = MetadataField.find_by_name(field_or_name)
    else
      raise ArgumentError, "Expected MetadataField or String, got #{field_or_name.class.to_s}"
    end
    
    if field.field_type == 'taxonomy'
      terms = field.taxonomy_terms
      
      # Move "Other" language term to end
      if field.name == 'lang'
        other_term_index = nil
        terms.each_index do |index|
          if terms[index].term.downcase == 'other'
            other_term_index = index
          end
        end
        terms << terms.delete_at(other_term_index) unless other_term_index.nil?
      end
    end
    
    terms
  end
  
  def metadata_field_hint(field_or_name, context = nil)
    case field_or_name
    when MetadataField
      field = field_or_name
    when String
      field = MetadataField.find_by_name(field_or_name)
    else
      raise ArgumentError, "Expected MetadataField or String, got #{field_or_name.class.to_s}"
    end
  
    key = case context
    when :contribution
      "formtastic.hints.contribution.metadata.#{field.name}"
    when :attachment
      "formtastic.hints.attachment.metadata.#{field.name}"
    else
      "formtastic.hints.metadata_record.#{field.name}"
    end
    
    t(key, :default => '')
  end
  
  def metadata_field_label(field_or_name, context = nil)
    case field_or_name
    when MetadataField
      field = field_or_name
    when String
      field = MetadataField.find_by_name(field_or_name)
    else
      raise ArgumentError, "Expected MetadataField or String, got #{field_or_name.class.to_s}"
    end
    
    key = case context
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
