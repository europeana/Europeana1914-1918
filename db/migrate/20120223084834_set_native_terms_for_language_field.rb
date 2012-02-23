class SetNativeTermsForLanguageField < ActiveRecord::Migration
  MAP = { 'Francais' => "Fran\u00E7ais", 'other' => 'Other' }
  NEW = [ "Sloven\u0161\u010Dina", 'Gaeilge' ]
  
  def self.up
    language_field = MetadataField.find_by_name('lang')
    
    MAP.each_pair do |from, to|
      tt = TaxonomyTerm.where(:metadata_field_id => language_field.id, :term => from).first
      tt.update_attribute(:term, to) unless tt.nil?
    end
    
    NEW.each do |term|
      tt = TaxonomyTerm.new
      tt.metadata_field_id = language_field.id
      tt.term = term
      tt.save
    end
  end

  def self.down
    language_field = MetadataField.find_by_name('lang')
    
    NEW.each do |term|
      TaxonomyTerm.where(:metadata_field_id => language_field.id, :term => term).first.destroy
    end
    
    MAP.each_pair do |from, to|
      tt = TaxonomyTerm.where(:metadata_field_id => language_field.id, :term => to).first
      tt.update_attribute(:term, from) unless tt.nil?
    end
  end
end
