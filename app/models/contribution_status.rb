class ContributionStatus < ActiveRecord::Base
  DRAFT     = 1
  SUBMITTED = 2
  APPROVED  = 3
  REJECTED  = 4
  REVISED   = 5
  
  belongs_to :user
  belongs_to :contribution
  
  validates_presence_of :contribution_id, :status
  validates_presence_of :user_id, :if => Proc.new { RunCoCo.configuration.registration_required? }
  validates_inclusion_of :status, :in => [ DRAFT, SUBMITTED, APPROVED, REJECTED, REVISED ]
  
#  after_create :set_contribution_current_status
  after_destroy :rollback_contribution_current_status
  
  ##
  # Symbol representing this status
  #
  # Return value will be one of:
  # * :draft
  # * :submitted
  # * :approved
  # * :rejected
  # * :revised
  # * nil if status is unknown
  # 
  # @return [Symbol]
  def to_sym
    case status
    when DRAFT
      :draft
    when SUBMITTED
      :submitted
    when APPROVED
      :approved
    when REJECTED
      :rejected
    when REVISED
      :revised
    else
      nil
    end
  end
  
  protected
#  def set_contribution_current_status
#    if contribution = Contribution.find(contribution_id)
#      # Do this instead of update_attribute so that contribution's delta index
#      # is set.
#      contribution.current_status_id = id
#      contribution.save
#    end
#  end
  
  def rollback_contribution_current_status
    if (contribution = Contribution.find(contribution_id)) && (contribution.current_status_id == id)
      if contribution.statuses.present? && (contribution.statuses.last.id != id)
        contribution.current_status_id = contribution.statuses.last.id
        contribution.save
      end
    end
  end
end
