class CreateNewMetadataFieldsForAttachments < ActiveRecord::Migration
  OLD_ORDER = {
    :alternative=>1, :page_number=>2, :description=>3, :lang=>4, :lang_other=>5, :content=>6, :subject=>7, :contributor_behalf=>8, :date=>9, :date_from=>10, :date_to=>11, :location_placename=>12, :location_map=>13, :keywords=>14, :theatres=>15, :forces=>16, :editor_pick=>17, :cataloguer=>18, :collection_day=>19, :source=>20, :format=>21, :page_total=>22, :notes=>23, :file_type=>24, :creator=>25
  }
  NEW_ORDER = {
    :alternative=>1, :cover_image=>2, :page_number=>3, :object_side=>4, :creator_family_name=>5, :creator_given_name=>6, :description=>7, :lang=>8, :lang_other=>9, :content=>10, :subject=>11, :contributor_behalf=>12, :date=>13, :date_from=>14, :date_to=>15, :location_placename=>16, :location_map=>17, :keywords=>18, :theatres=>19, :forces=>20, :editor_pick=>21, :cataloguer=>22, :collection_day=>23, :source=>24, :format=>25, :page_total=>26, :notes=>27, :file_type=>28, :license=>29, :creator=>30
  }

  def self.up
    MetadataField.create(:name => 'object_side', :field_type => 'taxonomy', :title => 'Side', :cataloguing => false, :contribution => false, :attachment => true, :searchable => false, :required => false, :show_in_listing => false, :multi => false)
    MetadataField.create(:name => 'cover_image', :field_type => 'taxonomy', :title => 'Cover image', :cataloguing => false, :contribution => false, :attachment => true, :searchable => false, :required => false, :show_in_listing => false, :multi => true)
    MetadataField.create(:name => 'creator_family_name', :field_type => 'string', :title => "Creator's surname", :cataloguing => false, :contribution => false, :attachment => true, :searchable => true, :required => false, :show_in_listing => false)
    MetadataField.create(:name => 'creator_given_name', :field_type => 'string', :title => "Creator's first name", :cataloguing => false, :contribution => false, :attachment => true, :searchable => true, :required => false, :show_in_listing => false)
    MetadataField.create(:name => 'license', :field_type => 'taxonomy', :title => "License", :cataloguing => true, :contribution => false, :attachment => true, :searchable => false, :required => false, :show_in_listing => false, :multi => false)
    
    MetadataField.find_by_name('object_side').taxonomy_terms.create_from_list('Front,Back', ',')
    MetadataField.find_by_name('cover_image').taxonomy_terms.create_from_list('yes', ',')
    MetadataField.find_by_name('license').taxonomy_terms.create_from_list('cc-by-sa,public domain', ',')
    
    NEW_ORDER.each_pair do |name, position|
      MetadataField.find_by_name(name).update_attribute(:position, position)
    end
  end

  def self.down
    [ 'object_side', 'cover_image', 'creator_family_name', 'creator_given_name', 'license' ].each do |name|
      MetadataField.find_by_name(name).destroy
    end
    
    OLD_ORDER.each_pair do |name, position|
      MetadataField.find_by_name(name).update_attribute(:position, position)
    end
  end
end
