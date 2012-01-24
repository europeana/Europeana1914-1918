class AddAttachmentToMetadataField < ActiveRecord::Migration
  def self.up
    add_column 'metadata_fields', 'attachment', :boolean, :default => true, :null => false
  end

  def self.down
    remove_column 'metadata_fields', 'attachment'
  end
end
