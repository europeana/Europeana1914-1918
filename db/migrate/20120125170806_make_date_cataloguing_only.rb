class MakeDateCataloguingOnly < ActiveRecord::Migration
  def self.up
    MetadataField.find_by_name(:date).update_attribute(:cataloguing, true)
  end

  def self.down
    MetadataField.find_by_name(:date).update_attribute(:cataloguing, false)
  end
end
