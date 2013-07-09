class AddStoryCharacterMetadataFields < ActiveRecord::Migration
  OLD_ORDER = {
    :alternative=>1, :cover_image=>2, :page_number=>3, :object_side=>4, :creator_family_name=>5, :creator_given_name=>6, :description=>7, :lang=>8, :lang_other=>9, :content=>10, :subject=>11, :contributor_behalf=>12, :date=>13, :date_from=>14, :date_to=>15, :location_placename=>16, :location_map=>17, :keywords=>18, :theatres=>19, :forces=>20, :editor_pick=>21, :cataloguer=>22, :collection_day=>23, :source=>24, :format=>25, :page_total=>26, :notes=>27, :file_type=>28, :license=>29, :creator=>30
  }
  NEW_ORDER = {
    :alternative=>1, :cover_image=>2, :page_number=>3, :object_side=>4, :creator_family_name=>5, :creator_given_name=>6, :description=>7, :lang=>8, :lang_other=>9, :content=>10, :subject=>11, :contributor_behalf=>12, :character1_family_name=>13, :character1_given_name=>14, :character2_family_name=>15, :character2_given_name=>16, :date=>17, :date_from=>18, :date_to=>19, :location_placename=>20, :location_map=>21, :keywords=>22, :theatres=>23, :forces=>24, :editor_pick=>25, :cataloguer=>26, :collection_day=>27, :source=>28, :format=>29, :page_total=>30, :notes=>31, :file_type=>32, :license=>33, :creator=>34
  }

  def self.up
    MetadataField.create(:name => 'character1_family_name', :field_type => 'string', :title => "Character 1's surname", :cataloguing => false, :contribution => true, :attachment => false, :searchable => true, :required => false, :show_in_listing => false)
    MetadataField.create(:name => 'character1_given_name', :field_type => 'string', :title => "Character 1's first name", :cataloguing => false, :contribution => true, :attachment => false, :searchable => true, :required => false, :show_in_listing => false)
    MetadataField.create(:name => 'character2_family_name', :field_type => 'string', :title => "Character 2's surname", :cataloguing => false, :contribution => true, :attachment => false, :searchable => true, :required => false, :show_in_listing => false)
    MetadataField.create(:name => 'character2_given_name', :field_type => 'string', :title => "Character 2's first name", :cataloguing => false, :contribution => true, :attachment => false, :searchable => true, :required => false, :show_in_listing => false)
    
    NEW_ORDER.each_pair do |name, position|
      MetadataField.find_by_name(name).update_attribute(:position, position)
    end
  end

  def self.down
    [ 'character1_family_name', 'character1_given_name', 'character2_family_name', 'character2_given_name' ].each do |name|
      MetadataField.find_by_name(name).destroy
    end
    
    OLD_ORDER.each_pair do |name, position|
      MetadataField.find_by_name(name).update_attribute(:position, position)
    end
  end
end
