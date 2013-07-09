class AddCurrentStatusToContribution < ActiveRecord::Migration
  class Contribution < ActiveRecord::Base; end
  class ContributionStatus < ActiveRecord::Base; end
  
  def self.up
    add_column "contributions", "current_status", :integer
    add_column "contributions", "status_timestamp", :timestamp
    
    say "Assigning `contributions`.`current_status` from `contribution_statuses`"
    Contribution.find_each do |c|
      if status = ContributionStatus.where(:contribution_id => c.id).order('created_at DESC').first
        c.current_status = status.status
        c.status_timestamp = status.created_at
        c.save
      end
    end
  end

  def self.down
    remove_column "contributions", "current_status"
    remove_column "contributions", "status_timestamp"
  end
end
