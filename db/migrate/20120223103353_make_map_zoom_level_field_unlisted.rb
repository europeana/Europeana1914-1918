class MakeMapZoomLevelFieldUnlisted < ActiveRecord::Migration
 def self.up
    MetadataField.find_by_name(:location_zoom).update_attribute(:show_in_listing, false)
  end

  def self.down
    MetadataField.find_by_name(:location_zoom).update_attribute(:show_in_listing, true)
  end
end
