class RecordStatus < ActiveRecord::Base
  belongs_to :record, :polymorphic => true
  belongs_to :user
  
  validates_presence_of :name
  validates_inclusion_of :name, :in => lambda { |status| status.record.class.valid_record_statuses }
  
  def to_sym
    name.to_sym
  end
end
