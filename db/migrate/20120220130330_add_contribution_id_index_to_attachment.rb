class AddContributionIdIndexToAttachment < ActiveRecord::Migration
  def self.up
    add_index "attachments", ["contribution_id"]
  end

  def self.down
    remove_index "attachments", ["contribution_id"]
  end
end
