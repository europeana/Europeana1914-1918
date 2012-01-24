class AddContributionToMetadataField < ActiveRecord::Migration
  def self.up
    add_column 'metadata_fields', 'contribution', :boolean, :default => true, :null => false
  end

  def self.down
    remove_column 'metadata_fields', 'contribution'
  end
end
