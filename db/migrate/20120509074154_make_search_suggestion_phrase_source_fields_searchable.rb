class MakeSearchSuggestionPhraseSourceFieldsSearchable < ActiveRecord::Migration
  UP_FIELDS = [ "keywords", "theatres", "content" ]
  DOWN_FIELDS = [ "collection_day" ]
  
  class MetadataField < ActiveRecord::Base; end
  
  def self.up
    MetadataField.update_all({ :searchable => false }, { :name => DOWN_FIELDS })
    MetadataField.update_all({ :searchable => true }, { :name => UP_FIELDS })
  end

  def self.down
    MetadataField.update_all({ :searchable => false }, { :name => UP_FIELDS })
    MetadataField.update_all({ :searchable => true }, { :name => DOWN_FIELDS })
  end
end
