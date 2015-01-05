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
  
  def cc_rights(cc_url)
    cc_rights = {
      "http://creativecommons.org/publicdomain/zero" => {
        "text" => "CC0",
        "icon" => "icon-cczero"
      },
      "http://creativecommons.org/licenses/by/" => {
        "text" => "CC BY",
        "icon" => "icon-cc icon-by"
      },
      "http://creativecommons.org/licenses/by-sa/" => {
        "text" => "CC BY-SA",
        "icon" => "icon-cc icon-by icon-sa"
      },
      "http://creativecommons.org/licenses/by-nc-sa/" => {
        "text" => "CC BY-NC-SA",
        "icon" => "icon-cc icon-by icon-nceu icon-sa"
      },
      "http://creativecommons.org/licenses/by-nd/" => {
        "text" => "CC BY-ND",
        "icon" => "icon-cc icon-by icon-nd"
      },
      "http://creativecommons.org/licenses/by-nc/" => {
        "text" => "CC BY-NC",
        "icon" => "icon-cc icon-by icon-nceu"
      },
      "http://creativecommons.org/licenses/by-nc-nd/" => {
        "text" => "CC BY-NC-ND",
        "icon" => "icon-cc icon-by icon-nceu icon-nd"
      },
      "http://creativecommons.org/publicdomain/mark/1.0/" => {
        "text" => "Public Domain marked",
        "icon" => "icon-pd"
      },
      "http://www.europeana.eu/rights/rr-f/" => {
        "text" => "Free Access - Rights Reserved",
        "icon" => "icon-copyright"
      },
      "http://www.europeana.eu/rights/rr-p/" => {
        "text" => "Paid Access - Rights Reserved",
        "icon" => "icon-copyright"
      },
      "http://www.europeana.eu/rights/rr-r/" => {
        "text" => "Restricted Access - Rights Reserved",
        "icon" => "icon-copyright"
      },
      "http://www.europeana.eu/rights/test-orphan-work-test/" => {
        "text" => "Orphan Work",
        "icon" => "icon-unknown"
      },
      "http://www.europeana.eu/rights/unknown/" => {
        "text" => "Unknown copyright status",
        "icon" => "icon-unknown"
      }
    }
    if cc_rights.has_key?(cc_url)
      cc_rights[cc_url]
    else
      { 
        "text" => "Unknown copyright status",
        "icon" => "icon-unknown"
      }
    end
  end
end
