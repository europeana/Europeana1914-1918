class FacetExistingMetadataFields < ActiveRecord::Migration
  FIELD_NAMES = [ 'keywords', 'theatres', 'content', 'lang', 'license', 'collection_day', 'file_type' ]
  
  def self.up
    FIELD_NAMES.each do |field_name|
      MetadataField.find_by_name(field_name).update_attribute(:facet, true)
    end
  end

  def self.down
    FIELD_NAMES.each do |field_name|
      MetadataField.find_by_name(field_name).update_attribute(:facet, false)
    end
  end
end
