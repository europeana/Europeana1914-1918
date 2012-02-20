class AddMissingForeignKeyIndexes < ActiveRecord::Migration
  def self.up
    add_index "contributions", ["guest_id"]
    add_index "metadata_records_taxonomy_terms", ["metadata_record_id", "taxonomy_term_id"], :name => 'index', :unique => true
    add_index "taxonomy_terms", ["metadata_field_id"]
    add_index "users", ["contact_id"]
  end

  def self.down
    remove_index "users", ["contact_id"]
    remove_index "taxonomy_terms", ["metadata_field_id"]
    remove_index "metadata_records_taxonomy_terms", :name => 'index'
    remove_index "contributions", ["guest_id"]
  end
end
