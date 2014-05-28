class RecordStatus < ActiveRecord::Base
  belongs_to :record, :polymorphic => true
  belongs_to :user
  
  validates_presence_of :name
  validates_inclusion_of :name, :in => lambda { |status| status.record.class.valid_record_statuses }
  
  after_create :update_current_status
  
  def to_sym
    name.to_sym
  end
  
  def update_current_status
    unless current_status = record.current_status
      current_status = CurrentStatus.new
      current_status.record = record
    end
    
    current_status.name = name
    current_status.save!
  end
end
