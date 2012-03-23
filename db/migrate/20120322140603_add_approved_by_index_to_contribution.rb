class AddApprovedByIndexToContribution < ActiveRecord::Migration
  def self.up
    add_index "contributions", ["approved_by"], :name => "index_contributions_on_approved_by"
  end

  def self.down
    remove_index "contributions", :name => "index_contributions_on_approved_by"
  end
end
