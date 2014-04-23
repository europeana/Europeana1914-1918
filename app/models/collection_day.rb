class CollectionDay < ActiveRecord::Base
  belongs_to :taxonomy_term
  belongs_to :contact
  
  validates_presence_of :taxonomy_term, :name
  validates_uniqueness_of :taxonomy_term_id
  
  validate :validate_taxonomy_term_belongs_to_collection_day_metadata_field
  
  def code
    taxonomy_term.term
  end
  
protected

  def validate_taxonomy_term_belongs_to_collection_day_metadata_field
    unless taxonomy_term.metadata_field.name == 'collection_day'
      errors.add :taxonomy_term, I18n.t('activerecord.errors.models.collection_day.taxonomy_term_metadata_field')
    end
  end
end
