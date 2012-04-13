class SeedRejectedContributionStatuses < ActiveRecord::Migration
  class Contribution < ActiveRecord::Base; end
  class ContributionStatus < ActiveRecord::Base
    REJECTED = 4
  end
  
  def self.up
    say "Seeding rejected contribution statuses from `contributions`.`rejected_at`"
    
    Contribution.where('rejected_at IS NOT NULL').find_each do |c|
      ContributionStatus.create!(:contribution_id => c.id, :user_id => c.rejected_by, :status => ContributionStatus::REJECTED, :created_at => c.rejected_at)
    end
  end

  def self.down
    say "Deleting all rejected contribution statuses from `contribution_statuses`"
        
    ContributionStatus.delete_all(:status => ContributionStatus::REJECTED)
  end
end
