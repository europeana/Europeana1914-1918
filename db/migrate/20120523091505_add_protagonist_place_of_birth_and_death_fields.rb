class AddProtagonistPlaceOfBirthAndDeathFields < ActiveRecord::Migration
  class MetadataField < ActiveRecord::Base; end
  
  def self.up
    { 
      'character1_dob' => [ 'character1_pob', "Character 1's place of birth" ], 
      'character1_dod' => [ 'character1_pod', "Character 1's place of death" ],
      'character2_dob' => [ 'character2_pob', "Character 2's place of birth" ], 
      'character2_dod' => [ 'character2_pod', "Character 2's place of death" ] 
    }.each_pair do |date_field_name, place_field_attrs|
    
      place_field_name, place_field_title = place_field_attrs
      
      date_field = MetadataField.find_by_name(date_field_name)
      
      if date_field.blank?
        say "No date field \"#{date_field_name}\" found; skipping addition of place field \"#{place_field_name}\"."
      else
        MetadataField.update_all('position = position + 1', [ 'position > ?', date_field.position ])
        
        MetadataField.create!(:name => place_field_name, :field_type => 'string',
          :title => place_field_title, :required => false, 
          :cataloguing => false, :contribution => true, :attachment => false, 
          :searchable => false, :position => date_field.position + 1)
        add_column "metadata_records", "field_#{place_field_name}", :string
      end
      
    end
  end

  def self.down
    [ 'character1_pob', 'character1_pod', 
      'character2_pob', 'character2_pod' ].each do |place_field_name|
      if place_field = MetadataField.find_by_name(place_field_name)
        place_field_position = place_field.position
        place_field.destroy
        MetadataField.update_all('position = position - 1', [ 'position > ?', place_field_position ])
      end
      remove_column "metadata_records", "field_#{place_field_name}"
    end
  end
end
