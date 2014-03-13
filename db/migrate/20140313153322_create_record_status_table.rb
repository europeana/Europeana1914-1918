class CreateRecordStatusTable < ActiveRecord::Migration
  def up
    create_table(:record_statuses) do |t|
      t.integer  "record_id"
      t.string   "record_type"
      t.string   "status"
      t.integer  "user_id"
      t.datetime "created_at"
    end
    add_index "record_statuses", [ "record_id", "record_type" ]
    add_index "record_statuses", "user_id"
    add_index "record_statuses", "status"
  end

  def down
    drop_table "record_statuses"
  end
end
