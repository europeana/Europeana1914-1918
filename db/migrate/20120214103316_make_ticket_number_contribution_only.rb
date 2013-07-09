class MakeTicketNumberContributionOnly < ActiveRecord::Migration
  def self.up
    MetadataField.find_by_name(:ticket).update_attribute(:attachment, false)
  end

  def self.down
    MetadataField.find_by_name(:ticket).update_attribute(:attachment, true)
  end
end
