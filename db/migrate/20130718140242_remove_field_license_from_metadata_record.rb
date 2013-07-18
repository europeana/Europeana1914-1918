# metadata_records.field_license column redundant since license converted to
# a taxonomy type field.
class RemoveFieldLicenseFromMetadataRecord < ActiveRecord::Migration
  def self.up
    remove_column :metadata_records, :field_license
  end

  def self.down
    add_column :metdata_records, :field_license, :string
  end
end
