class SeedDraftContributionStatuses < ActiveRecord::Migration
  class Contribution < ActiveRecord::Base; end
  class ContributionStatus < ActiveRecord::Base
    DRAFT = 1
  end
  
  def self.up
    say "Seeding draft contribution statuses from `contributions`.`created_at`"
    
    Contribution.find_each do |c|
      ContributionStatus.create!(:contribution_id => c.id, :user_id => c.contributor_id, :status => ContributionStatus::DRAFT, :created_at => c.created_at)
    end
  end

  def self.down
    say "Deleting all draft contribution statuses from `contribution_statuses`"
        
    ContributionStatus.delete_all(:status => ContributionStatus::DRAFT)
  end
end
