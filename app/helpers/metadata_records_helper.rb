module MetadataRecordsHelper
  ##
  # Gets the metadata fields to display on contribution/attachment forms
  #
  # @param  [Hash{Symbol => Object}]  options
  # @option options [Boolean] :attachment  (nil)
  # @option options [Boolean] :cataloguing  (nil)
  # @option options [Boolean] :contribution  (nil)
  # @option options [Array{String}] :name  (nil)
  def metadata_record_fields(options = {})
    options.assert_valid_keys(:attachment, :cataloguing, :contribution, :name)
    conditions = options.dup
    MetadataField.where(conditions).order('position ASC')
  end
  
  def metadata_field_hint(field)
    raw [ h(field.hint), t("formtastic.hints.metadata_record.#{field.field_type}", :default => '') ].select { |h| h.present? }.join('<br />')
  end
  
  def metadata_record_field_value(metadata, field)
    value = metadata[field.column_name]
    if (field.field_type == 'geo') && !value.blank?
      content_tag(:span, value, :class => 'geo') +
      content_tag(:noscript, 
        content_tag(:div, 
          image_tag("http://maps.google.com/maps/api/staticmap?center=#{value}&amp;size=470x470&amp;zoom=13&amp;sensor=false", :alt => ''),
          :class => 'gmap-static'
        )
      )
    elsif field.field_type == 'taxonomy'
      if metadata.fields[field.name].present?
        metadata.fields[field.name].to_sentence
      end
    elsif field.field_type == 'text'
      content_tag(:div, value, :class => 'metadata-text')
    else
      value
    end
  end
end
