class IndexCurrentStatusesOnName < ActiveRecord::Migration
  def up
    add_index "current_statuses", "name"
  end

  def down
    remove_index "current_statuses", "name"
  end
end
