class ChangeCollectionDayFieldToTaxonomyType < ActiveRecord::Migration
  class Contribution < ActiveRecord::Base
    belongs_to :metadata, :class_name => 'MetadataRecord', :foreign_key => 'metadata_record_id', :dependent => :destroy
  end
  class MetadataField < ActiveRecord::Base
    has_many :taxonomy_terms, :dependent => :destroy
  end
  class MetadataRecord < ActiveRecord::Base
    has_one :contribution
    has_and_belongs_to_many :taxonomy_terms
  end
  class TaxonomyTerm < ActiveRecord::Base
    has_and_belongs_to_many :metadata_records
    belongs_to :metadata_field
  end

  def self.up
    say_with_time "Changing collection day field to taxonomy type" do
      string_field = MetadataField.find_by_name('collection_day')
      if string_field.blank?
        raise Exception, "No collection_day string field found"
      elsif string_field.field_type != 'string'
        raise Exception, "Expected collection_day field to be of type string, got #{string_field.field_type}"
      end
      position = string_field.position
      
      say "Creating new taxonomy field named collection_day_code"
      tax_field = MetadataField.create!(:name => 'collection_day_code', 
        :field_type => 'taxonomy', :contribution => true, :attachment => false, 
        :required => true, :cataloguing => true, :searchable => true,
        :title => string_field.title, :hint => string_field.hint)

      say "Adding taxonomy terms from collection_day field values"
      MetadataRecord.where("field_collection_day IS NOT NULL AND field_collection_day <>''").collect do |mr| 
        mr.field_collection_day 
      end.uniq.each do |collection_day|
        tax_field.taxonomy_terms.create(:term => collection_day)
      end
      
      say "Associating metadata records with new taxonomy terms"
      tax_field.taxonomy_terms.each do |tt|
        say "Collection day \"#{tt.term}\"", true
        MetadataRecord.where('field_collection_day' => tt.term).each do |mr|
          mr.taxonomy_terms << tt
        end
      end
      
      [ 'INTERNET', 'UNKNOWN' ].each do |term|
        if tax_field.taxonomy_terms.where(:term => term).blank?
          say "Adding additional term \"#{term}\""
          tax_field.taxonomy_terms.create(:term => term) 
        end
      end
      
      say "Setting approved contributions without collection_day value to \"UNKNOWN\""
      unknown_term = tax_field.taxonomy_terms.where(:term => 'UNKNOWN').first
      Contribution.where("(metadata_records.field_collection_day IS NULL OR metadata_records.field_collection_day = '') AND approved_at IS NOT NULL").includes(:metadata).each do |contribution|
        contribution.metadata.taxonomy_terms << unknown_term
      end
      
      say "Deleting collection_day string field"
      string_field.destroy
      remove_column("metadata_records", "field_collection_day")

      say "Setting position of collection_day_code field to that of deleted string field"
      tax_field.update_attributes!(:position => position)

      say "Renaming collection_day_code field to collection_day"
      tax_field.update_attributes!(:name => 'collection_day')
    end
  end

  def self.down
    say_with_time "Changing collection day field back to string type" do
      tax_field = MetadataField.find_by_name('collection_day')
      if tax_field.blank?
        raise Exception, "No collection_day taxonomy field found"
      elsif tax_field.field_type != 'taxonomy'
        raise Exception, "Expected collection_day field to be of type taxonomy, got #{tax_field.field_type}"
      end
      position = tax_field.position
      
      say "Renaming collection_day field to collection_day_code"
      tax_field.update_attributes!(:name => 'collection_day_code')
      
      say "Creating new string field collection_day"
      string_field = MetadataField.create!(:name => 'collection_day', 
        :field_type => 'string', :contribution => true, :attachment => false, 
        :required => false, :cataloguing => true, :searchable => true,
        :title => tax_field.title, :hint => tax_field.hint)
      add_column("metadata_records", "field_collection_day", :string)
    
      say "Populating string field from taxonomy field"
      tax_field.taxonomy_terms.each do |tt|
        say "Collection day \"#{tt.term}\"", true
        MetadataRecord.update_all({ :field_collection_day => tt.term }, { :id => tt.metadata_record_ids })
      end
      
      say "Clearing collection_day value on approved contributions set to \"UNKNOWN\""
      MetadataRecord.update_all({ :field_collection_day => '' }, { :field_collection_day => 'UNKNOWN' })
    
      say "Deleting collection_day_code taxonomy field" 
      tax_field.destroy
      
      say "Setting position of collection_day field to that of deleted taxonomy field"
      string_field.update_attributes!(:position => position)
    end
  end
end
