class SeedSubmittedContributionStatuses < ActiveRecord::Migration
  class Contribution < ActiveRecord::Base; end
  class ContributionStatus < ActiveRecord::Base
    SUBMITTED = 2
  end
  
  def self.up
    say "Seeding submitted contribution statuses from `contributions`.`submitted_at`"
    
    Contribution.where('submitted_at IS NOT NULL').find_each do |c|
      ContributionStatus.create!(:contribution_id => c.id, :user_id => c.contributor_id, :status => ContributionStatus::SUBMITTED, :created_at => c.submitted_at)
    end
  end

  def self.down
    say "Deleting all submitted contribution statuses from `contribution_statuses`"
        
    ContributionStatus.delete_all(:status => ContributionStatus::SUBMITTED)
  end
end
