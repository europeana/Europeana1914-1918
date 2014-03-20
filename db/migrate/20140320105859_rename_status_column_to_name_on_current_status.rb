class RenameStatusColumnToNameOnCurrentStatus < ActiveRecord::Migration
  def up
    rename_column "record_statuses", "status", "name"
  end

  def down
    rename_column "record_statuses", "name", "status"
  end
end
