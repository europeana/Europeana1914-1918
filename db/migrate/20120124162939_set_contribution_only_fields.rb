class SetContributionOnlyFields < ActiveRecord::Migration
  FIELDS = [ :contributor_behalf, :editor_pick, :cataloguer, :collection_day ]

  def self.up
    FIELDS.each do |name|
      MetadataField.find_by_name(name).update_attribute(:attachment, false)
    end
  end

  def self.down
    FIELDS.each do |name|
      MetadataField.find_by_name(name).update_attribute(:attachment, true)
    end
  end
end
