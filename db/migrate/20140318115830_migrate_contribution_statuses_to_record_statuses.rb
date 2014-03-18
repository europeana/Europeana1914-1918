class MigrateContributionStatusesToRecordStatuses < ActiveRecord::Migration
  class ContributionStatus < ActiveRecord::Base
    belongs_to :contribution
  end
  
  class Contribution < ActiveRecord::Base
    has_many :contribution_statuses
    has_record_statuses :draft, :submitted, :approved, :rejected, :revised, :withdrawn
  end
  
  def up
    print "Creating RecordStatus records from ContributionStatus records..."
    contribution_statuses = {
      1 => :draft,
      2 => :submitted,
      3 => :approved,
      4 => :rejected,
      5 => :revised,
      6 => :withdrawn
    }
    
    ContributionStatus.find_each do |status|
      RecordStatus.create!(
        :record => status.contribution,
        :status => contribution_statuses[status.status], :user_id => status.user_id, :created_at => status.created_at
      )
    end
    
    puts " done."
  end

  def down
  end
end
