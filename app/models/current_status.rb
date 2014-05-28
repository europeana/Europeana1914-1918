class CurrentStatus < ActiveRecord::Base
  belongs_to :record, :polymorphic => true
  validates_presence_of :name
  
  def to_sym
    name.to_sym
  end
end
