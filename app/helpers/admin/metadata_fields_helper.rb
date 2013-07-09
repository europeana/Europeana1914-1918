module Admin::MetadataFieldsHelper
  def options_for_metadata_field_type
    [ 'date', 'geo', 'taxonomy', 'text', 'string' ].map do |ft| 
      [ I18n.t(ft, :scope => 'activerecord.options.metadata_field.field_type'), ft ]
    end.sort do |x,y|
      x.first <=> y.first
    end
  end
  
  def metadata_field_type_label(field_type)
    options_for_metadata_field_type.each do |option|
      if option.last == field_type
        return option.first
      end
    end
    nil
  end
end
