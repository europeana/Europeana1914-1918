class AddShowInListingToMetadataField < ActiveRecord::Migration
  def self.up
    add_column "metadata_fields", "show_in_listing", :boolean, :default => false
  end

  def self.down
    remove_column "metadata_fields", "show_in_listing"
  end
end
