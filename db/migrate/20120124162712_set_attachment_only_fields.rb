class SetAttachmentOnlyFields < ActiveRecord::Migration
  FIELDS = [ :page_number, :content, :subject, :page_total, :source, :format, :file_type ]

  def self.up
    FIELDS.each do |name|
      MetadataField.find_by_name(name).update_attribute(:contribution, false)
    end
  end

  def self.down
    FIELDS.each do |name|
      MetadataField.find_by_name(name).update_attribute(:contribution, true)
    end
  end
end
