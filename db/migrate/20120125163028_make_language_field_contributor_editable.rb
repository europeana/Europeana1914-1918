class MakeLanguageFieldContributorEditable < ActiveRecord::Migration
  def self.up
    MetadataField.find_by_name(:lang).update_attribute(:cataloguing, false)
  end

  def self.down
    MetadataField.find_by_name(:lang).update_attribute(:cataloguing, true)
  end
end
