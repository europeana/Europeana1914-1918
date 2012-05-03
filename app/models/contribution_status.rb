class ContributionStatus < ActiveRecord::Base
  DRAFT     = 1
  SUBMITTED = 2
  APPROVED  = 3
  REJECTED  = 4
  REVISED   = 5
  WITHDRAWN = 6
  
  belongs_to :user
  belongs_to :contribution
  
  validates_presence_of :contribution_id, :status
  validates_presence_of :user_id, :if => Proc.new { RunCoCo.configuration.registration_required? }
  validates_inclusion_of :status, :in => [ DRAFT, SUBMITTED, APPROVED, REJECTED, REVISED, WITHDRAWN ]
  
  after_destroy :rollback_contribution_current_status
  
  ##
  # Symbol representing a contribution status
  #
  # Return value will be one of:
  # * :draft
  # * :submitted
  # * :approved
  # * :rejected
  # * :revised
  # * :withdrawn
  # * nil if status is unknown
  # 
  # @return [Symbol]
  #
  def self.to_sym(status)
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
    when WITHDRAWN
      :withdrawn
    else
      nil
    end
  end
  
  def self.published
    if !RunCoCo.configuration.publish_contributions
      -1
    else
      if RunCoCo.configuration.contribution_approval_required
        APPROVED
      else
        SUBMITTED
      end
    end
  end
  
  ##
  # Symbol representing this status
  #
  # @see .to_sym
  def to_sym
    self.class.to_sym(self.status)
  end
  
  protected
  
  def rollback_contribution_current_status
    if (contribution = Contribution.find(contribution_id)) && (contribution.current_status_id == id)
      if contribution.statuses.present? && (contribution.statuses.last.id != id)
        contribution.current_status_id = contribution.statuses.last.id
        contribution.save
      end
    end
  end
end
