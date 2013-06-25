class AddMetaToAttachment < ActiveRecord::Migration
  def self.up
    add_column :attachments, :file_meta, :text
  end

  def self.down
    remove_column :attachments, :file_meta
  end
end
