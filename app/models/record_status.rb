class RecordStatus < ActiveRecord::Base
  belongs_to :record, :polymorphic => true
  belongs_to :user
  
  validates_presence_of :status
  validates_inclusion_of :status, :in => lambda { |status| status.record.class.valid_record_statuses }
  
  def to_sym
    status.to_sym
  end
end
