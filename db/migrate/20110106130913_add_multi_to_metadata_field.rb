class AddMultiToMetadataField < ActiveRecord::Migration
  def self.up
    add_column :metadata_fields, :multi, :boolean
    MetadataField.where('field_type = ?', 'taxonomy').each do |field|
      field.update_attributes(:multi => false)
    end
  end

  def self.down
    remove_column :metadata_fields, :multi
  end
end
