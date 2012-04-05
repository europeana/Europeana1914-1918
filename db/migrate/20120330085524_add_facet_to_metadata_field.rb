class AddFacetToMetadataField < ActiveRecord::Migration
  def self.up
    add_column "metadata_fields", "facet", :boolean, :default => false, :null => false
  end

  def self.down
    remove_column "metadata_fields", "facet"
  end
end
