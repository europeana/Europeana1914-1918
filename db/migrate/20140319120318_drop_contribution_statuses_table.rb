class DropContributionStatusesTable < ActiveRecord::Migration
  def up
    drop_table "contribution_statuses"
  end

  def down
    create_table "contribution_statuses", :force => true do |t|
      t.integer  "contribution_id", :null => false
      t.integer  "user_id"
      t.integer  "status",          :null => false
      t.datetime "created_at"
    end

    add_index "contribution_statuses", ["contribution_id"], :name => "index_contribution_statuses_on_contribution_id"
    add_index "contribution_statuses", ["status"], :name => "index_contribution_statuses_on_status"
    add_index "contribution_statuses", ["user_id"], :name => "index_contribution_statuses_on_user_id"
  end
end
