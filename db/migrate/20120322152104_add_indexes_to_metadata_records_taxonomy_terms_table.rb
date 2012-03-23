class AddIndexesToMetadataRecordsTaxonomyTermsTable < ActiveRecord::Migration
  def self.up
    add_index "metadata_records_taxonomy_terms", ["taxonomy_term_id", "metadata_record_id"], :unique => true, :name => :reverse_index
    add_index "metadata_records_taxonomy_terms", ["metadata_record_id"]
    add_index "metadata_records_taxonomy_terms", ["taxonomy_term_id"]
  end

  def self.down
    remove_index "metadata_records_taxonomy_terms", :name => "index_metadata_records_taxonomy_terms_on_taxonomy_term_id"
    remove_index "metadata_records_taxonomy_terms", :name => "index_metadata_records_taxonomy_terms_on_metadata_record_id"
    remove_index "metadata_records_taxonomy_terms", :name => "reverse_index"
  end
end
