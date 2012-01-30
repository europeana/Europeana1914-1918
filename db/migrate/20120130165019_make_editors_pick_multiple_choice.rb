class MakeEditorsPickMultipleChoice < ActiveRecord::Migration
  def self.up
    MetadataField.find_by_name(:editor_pick).update_attribute(:multi, true)
  end

  def self.down
    MetadataField.find_by_name(:editor_pick).update_attribute(:multi, false)
  end
end
