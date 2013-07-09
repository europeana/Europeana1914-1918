class FixMetadataFieldTypes < ActiveRecord::Migration
  def self.up
    say_with_time "Fixing metadata record column types" do
      change_column :metadata_records, :field_attachment_description, :text
      change_column :metadata_records, :field_summary, :text
    end
  end

  def self.down
    say "WARNING: Rolling back this migration would lose data irreversibly.
If you really want to do that, uncomment the lines in self.down in the
migration 20120224121442_fix_metadata_field_types"
#    say_with_time "Breaking metadata record column types" do
#      change_column :metadata_records, :field_attachment_description, :string
#      change_column :metadata_records, :field_summary, :string
#    end
  end
end
