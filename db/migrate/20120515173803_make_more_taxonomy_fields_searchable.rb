class MakeMoreTaxonomyFieldsSearchable < ActiveRecord::Migration
  FIELDS = [ "forces", "collection_day" ]
  
  class MetadataField < ActiveRecord::Base; end
  
  def self.up
    MetadataField.update_all({ :searchable => true }, { :name => FIELDS })
  end

  def self.down
    MetadataField.update_all({ :searchable => false }, { :name => FIELDS })
  end
end
