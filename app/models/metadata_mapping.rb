class MetadataMapping < ActiveRecord::Base
  belongs_to :mappable, :polymorphic => true
  has_one :oai_record, :class_name => 'OAIRecord', :dependent => :destroy

  validates :mappable, :format, :content, :presence => true
  validates :format, :uniqueness => { scope: [:mappable_id, :mappable_type] }

  after_create :create_oai_record
  after_update :touch_oai_record

  private

  def create_oai_record
    return unless mappable.respond_to?(:edm) && format == 'edm_rdfxml'

    OAIRecord.where(
      :metadata_prefix => 'oai_edm',
      :metadata_mapping_id => id
    ).first_or_create(
      :identifier => mappable.edm.ore_aggregation_uri.to_s,
      :created_at => mappable.created_at,
      :updated_at => mappable.updated_at
    )
  end

  def touch_oai_record
    oai_record.touch
  end
end
