module MetadataRecordsHelper
  ##
  # Gets the metadata fields to display on contribution/attachment forms.
  #
  # By default the returned array of fields will be ordered by the position
  # field in the {
  # @param [Hash] options
  # @option options [Boolean] :attachment Restrict to fields with this value
  #   for their attachment metadata record flag
  # @option options [Boolean] :cataloguing Restrict to fields with this value
  #   for their cataloguing-only flag
  # @option options [Boolean] :contribution Restrict to fields with this value
  #   for their contribution metadata record flag
  # @option options [Array<String>] :name Restrict to fields with these names
  # @option options [Boolean] :name_order If true, order returned fields as per
  #   the order given in the :name option; otherwise as per the position field.
  # @return [Array<MetadataField>]
  def metadata_record_fields(options = {})
    options.assert_valid_keys(:attachment, :cataloguing, :contribution, :name, :name_order)
    conditions = options.dup
    name_order = conditions.delete(:name_order)
    
    fields = MetadataField.where(conditions).order('position ASC')
    
    if name_order && options[:name].present?
      ordered_fields = []
      options[:name].each do |field_name|
        ordered_fields << fields.select { |field| field.name == field_name }
      end
      fields = ordered_fields.flatten
    end

    fields
  end
  
  def metadata_record_field_value(metadata, field, fmt_date = false, link = false)
    value = metadata[field.column_name]
    if field.name == 'license'
      if metadata.fields[field.name].present?
        license_image(metadata.fields[field.name].first)
      end
    elsif field.field_type == 'taxonomy'
      if metadata.fields[field.name].present?
        if link
          metadata.fields[field.name].collect do |term| 
            link_to(h(term), term_search_contributions_path(field.name, h(term)))
          end.to_sentence
        else
          metadata.fields[field.name].to_sentence
        end
      end
    elsif value.present?
      case field.field_type
      when 'geo'
        content_tag(:span, value, :class => 'geo')
#      content_tag(:span, value, :class => 'geo') +
#      content_tag(:noscript, 
#        content_tag(:div, 
#          image_tag("http://maps.google.com/maps/api/staticmap?center=#{value}&amp;size=470x470&amp;zoom=13&amp;sensor=false", :alt => ''),
#          :class => 'gmap-static'
#        )
#      )
      #when 'text'
      #  content_tag(:div, value, :class => 'metadata-text')
      when 'date'
        if fmt_date
          year, month, day = value.split('-')
          if day.present?
            year + ' ' + I18n.t('date.month_names')[month.to_i] + ' ' + day.to_i.to_s
          elsif month.present?
            year + ' ' + I18n.t('date.month_names')[month.to_i]
          else
            year
          end
        else
          value
        end
      else
        value
      end
    else
      ''
    end
  end
  
  def license_image(license)
    image = {
      'http://creativecommons.org/licenses/by-sa/3.0/' => {
        :alt => 'by-sa',
        :src => '/themes/v2/images/logos/cc/by-sa/3.0/88x31.png'
      },
      'http://creativecommons.org/publicdomain/mark/1.0/' => {
        :alt => 'public domain mark',
        :src => '/themes/v2/images/logos/cc/p/mark/1.0/88x31.png'
      }
    }[license]
    
    image.present? ? link_to(image_tag(image[:src], :alt => image[:alt]), license, :target => '_blank') : license
  end
  
  def metadata_json(obj)
    associations = MetadataField.where(:field_type => 'taxonomy').collect do |taxonomy_field|
      :"field_#{taxonomy_field.name}_term_ids"
    end
    obj.metadata.to_json(:except => [ :created_at, :id, :updated_at ], :methods => associations)
  end
end
