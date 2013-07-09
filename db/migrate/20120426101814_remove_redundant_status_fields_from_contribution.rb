class RemoveRedundantStatusFieldsFromContribution < ActiveRecord::Migration
  def self.up
    remove_index "contributions", :name => "index_contributions_on_approved_by"
    
    remove_column "contributions", "approved_at"
    remove_column "contributions", "approved_by"
    remove_column "contributions", "published_at"
    remove_column "contributions", "rejected_at"
    remove_column "contributions", "rejected_by"
    remove_column "contributions", "submitted_at"
  end

  def self.down
    add_column "contributions", "approved_at", :datetime
    add_column "contributions", "approved_by", :integer
    add_column "contributions", "published_at", :datetime
    add_column "contributions", "rejected_at", :datetime
    add_column "contributions", "rejected_by", :integer
    add_column "contributions", "submitted_at", :datetime
    
    add_index "contributions", ["approved_by"], :name => "index_contributions_on_approved_by"
  end
end
