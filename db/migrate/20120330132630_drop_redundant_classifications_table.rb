class DropRedundantClassificationsTable < ActiveRecord::Migration
  def self.up
    drop_table "classifications"
  end

  def self.down
    create_table "classifications" do |t|
      t.integer  "metadata_record_id"
      t.integer  "taxonomy_term_id"
      t.datetime "created_at"
      t.datetime "updated_at"
    end
  end
end
