class AddLifeSpanDateFieldsToMetadataRecord < ActiveRecord::Migration
  class MetadataField < ActiveRecord::Base; end
  
  def self.up
    c1fn = MetadataField.find_by_name('character1_family_name')
    if c1fn.blank?
      say "No character 1 family name field found; skipping addition of life span fields."
    else
      MetadataField.update_all('position = position + 2', [ 'position > ?', c1fn.position ])
      
      MetadataField.create!(:name => 'character1_dob', :field_type => 'date',
        :title => "Character 1's date of birth", :required => false, 
        :cataloguing => false, :contribution => true, :attachment => false, 
        :searchable => false, :position => c1fn.position + 1)
      add_column "metadata_records", "field_character1_dob", :string, :limit => 10

      MetadataField.create!(:name => 'character1_dod', :field_type => 'date',
        :title => "Character 1's date of death", :required => false, 
        :cataloguing => false, :contribution => true, :attachment => false, 
        :searchable => false, :position => c1fn.position + 2)
      add_column "metadata_records", "field_character1_dod", :string, :limit => 10
    end
    
    c2fn = MetadataField.find_by_name('character2_family_name')
    if c1fn.blank?
      say "No character 2 family name field found; skipping addition of life span fields."
    else
      MetadataField.update_all('position = position + 2', [ 'position > ?', c2fn.position ])
      
      MetadataField.create!(:name => 'character2_dob', :field_type => 'date',
        :title => "Character 2's date of birth", :required => false, 
        :cataloguing => false, :contribution => true, :attachment => false, 
        :searchable => false, :position => c2fn.position + 1)
      add_column "metadata_records", "field_character2_dob", :string, :limit => 10
      
      MetadataField.create!(:name => 'character2_dod', :field_type => 'date',
        :title => "Character 2's date of death", :required => false, 
        :cataloguing => false, :contribution => true, :attachment => false, 
        :searchable => false, :position => c2fn.position + 2)
      add_column "metadata_records", "field_character2_dod", :string, :limit => 10
    end
  end

  def self.down
    MetadataField.find_by_name('character1_dob').destroy
    remove_column "metadata_records", "field_character1_dob"
    
    MetadataField.find_by_name('character1_dod').destroy  
    remove_column "metadata_records", "field_character1_dod"
    
    MetadataField.find_by_name('character2_dob').destroy
    remove_column "metadata_records", "field_character2_dob"
    
    MetadataField.find_by_name('character2_dod').destroy  
    remove_column "metadata_records", "field_character2_dod"
  end
end
