class TaxonomyTerm < ActiveRecord::Base
  attr_accessible :term
  translates :term
  
  # TODO: Name this association "taxonomy_vocabulary"
  belongs_to :metadata_field
  has_and_belongs_to_many :metadata_records
  
  validates_presence_of :metadata_field_id, :term
  validates_uniqueness_of :term, :scope => :metadata_field_id
  validate :validate_metadata_field_taxonomy, :if => Proc.new { |term| term.metadata_field_id.present? }
  
  cattr_reader :per_page
  @@per_page = 40
  
  def validate_metadata_field_taxonomy
    self.errors.add(:metadata_field_id, I18n.t('activerecord.errors.models.taxonomy_term.attributes.metadata_field.type')) unless self.metadata_field.field_type == 'taxonomy'
  end
end
