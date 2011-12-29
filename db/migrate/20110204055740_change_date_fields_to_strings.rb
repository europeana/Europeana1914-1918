class ChangeDateFieldsToStrings < ActiveRecord::Migration
  def self.up
    MetadataField.where(:field_type => 'date').each do |field|
      change_column :metadata_records, field.column_name, :string, :limit => 10
    end
  end

  def self.down
    MetadataField.where(:field_type => 'date').each do |field|
      change_column :metadata_records, field.column_name, :date
    end
  end
end
