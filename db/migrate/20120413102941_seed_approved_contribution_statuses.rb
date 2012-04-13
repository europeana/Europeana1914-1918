class SeedApprovedContributionStatuses < ActiveRecord::Migration
  class Contribution < ActiveRecord::Base; end
  class ContributionStatus < ActiveRecord::Base
    APPROVED = 3
  end
  
  def self.up
    say "Seeding approved contribution statuses from `contributions`.`approved_at`"
    
    Contribution.where('approved_at IS NOT NULL').find_each do |c|
      ContributionStatus.create!(:contribution_id => c.id, :user_id => c.approved_by, :status => ContributionStatus::APPROVED, :created_at => c.approved_at)
    end
  end

  def self.down
    say "Deleting all approved contribution statuses from `contribution_statuses`"
    
    ContributionStatus.delete_all(:status => ContributionStatus::APPROVED)
  end
end
