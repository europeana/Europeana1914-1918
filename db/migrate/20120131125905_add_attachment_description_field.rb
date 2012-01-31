class AddAttachmentDescriptionField < ActiveRecord::Migration
  OLD_ORDER = {
    :alternative=>1, :cover_image=>2, :page_number=>3, :object_side=>4, :creator_family_name=>5, :creator_given_name=>6, :description=>7, :lang=>8, :lang_other=>9, :content=>10, :subject=>11, :contributor_behalf=>12, :character1_family_name=>13, :character1_given_name=>14, :character2_family_name=>15, :character2_given_name=>16, :date=>17, :date_from=>18, :date_to=>19, :location_placename=>20, :location_map=>21, :keywords=>22, :theatres=>23, :forces=>24, :editor_pick=>25, :cataloguer=>26, :collection_day=>27, :source=>28, :format=>29, :page_total=>30, :notes=>31, :file_type=>32, :license=>33, :creator=>34
  }
  NEW_ORDER = {
    :alternative=>1, :cover_image=>2, :page_number=>3, :object_side=>4, :creator_family_name=>5, :creator_given_name=>6, :description=>7, :attachment_description=>8, :lang=>9, :lang_other=>10, :content=>11, :subject=>12, :contributor_behalf=>13, :character1_family_name=>14, :character1_given_name=>15, :character2_family_name=>16, :character2_given_name=>17, :date=>18, :date_from=>19, :date_to=>20, :location_placename=>21, :location_map=>22, :keywords=>23, :theatres=>24, :forces=>25, :editor_pick=>26, :cataloguer=>27, :collection_day=>28, :source=>29, :format=>30, :page_total=>31, :notes=>32, :file_type=>33, :license=>34, :creator=>35
  }
  
  def self.up
    MetadataField.create(:name => 'attachment_description', :field_type => 'string', :title => "Attachment description", :cataloguing => false, :contribution => false, :attachment => true, :searchable => true, :required => false, :show_in_listing => false)
    
    MetadataField.find_by_name('description').update_attribute(:attachment, false)
    
    NEW_ORDER.each_pair do |name, position|
      MetadataField.find_by_name(name).update_attribute(:position, position)
    end
  end

  def self.down
    MetadataField.find_by_name('description').update_attribute(:attachment, true)
    MetadataField.find_by_name('attachment_description').destroy
    
    OLD_ORDER.each_pair do |name, position|
      MetadataField.find_by_name(name).update_attribute(:position, position)
    end
  end
end
