class CreateExportModel < ActiveRecord::Migration
  def self.up
    create_table(:exports) do |t|
      t.integer  "user_id"
      t.string   "file_file_name"
      t.string   "file_content_type"
      t.integer  "file_file_size"
      t.datetime "file_updated_at"
      t.datetime "created_at"
    end
    add_index "exports", "user_id"
  end

  def self.down
    drop_table "exports"
  end
end
