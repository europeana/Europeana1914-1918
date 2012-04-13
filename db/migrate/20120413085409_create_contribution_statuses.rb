class CreateContributionStatuses < ActiveRecord::Migration
  def self.up
    create_table :contribution_statuses do |t|
      t.integer "contribution_id", :null => false
      t.integer "user_id"
      t.integer "status", :null => false
      t.datetime "created_at"
    end
    add_index "contribution_statuses", ["contribution_id"]
    add_index "contribution_statuses", ["user_id"]
    add_index "contribution_statuses", ["status"]
  end

  def self.down
    drop_table :contribution_statuses
  end
end
