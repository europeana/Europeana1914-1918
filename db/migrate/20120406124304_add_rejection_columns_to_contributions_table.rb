class AddRejectionColumnsToContributionsTable < ActiveRecord::Migration
  def self.up
    add_column "contributions", "rejected_by", :integer
    add_column "contributions", "rejected_at", :datetime
  end

  def self.down
    remove_column "contributions", "rejected_by"
    remove_column "contributions", "rejected_at"
  end
end
