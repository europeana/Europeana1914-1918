class AddCurrentStatusIdToContribution < ActiveRecord::Migration
  class Contribution < ActiveRecord::Base; end
  class ContributionStatus < ActiveRecord::Base; end
  
  def self.up
    add_column "contributions", "current_status_id", :integer
    say "Assigning `contributions`.`current_status_id` from `contribution_statuses`"
    Contribution.find_each do |c|
      if status = ContributionStatus.where(:contribution_id => c.id).order('created_at DESC').first
        c.update_attribute(:current_status_id, status.id)
      end
    end
  end

  def self.down
    remove_column "contributions", "current_status_id"
  end
end
