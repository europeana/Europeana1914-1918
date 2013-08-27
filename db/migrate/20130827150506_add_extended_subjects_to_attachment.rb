class AddExtendedSubjectsToAttachment < ActiveRecord::Migration
  def self.up
    if mf = MetadataField.find_by_name("extended_subjects")
      mf.update_attribute("attachment", true)
    end
  end

  def self.down
    if mf = MetadataField.find_by_name("extended_subjects")
      mf.update_attribute("attachment", false)
    end
  end
end
