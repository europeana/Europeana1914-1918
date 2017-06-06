class MetadataMapping < ActiveRecord::Base
  belongs_to :mappable, :polymorphic => true

  validates :mappable, :format, :content, :presence => true
  validates :format, :uniqueness => { scope: [:mappable_id, :mappable_type] }
end
