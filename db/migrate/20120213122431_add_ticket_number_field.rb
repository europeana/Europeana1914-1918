class AddTicketNumberField < ActiveRecord::Migration
  OLD_ORDER = {
    :alternative=>1, :cover_image=>2, :page_number=>3, :object_side=>4, :creator_given_name=>5, :creator_family_name=>6, :description=>7, :summary=>8, :attachment_description=>9, :lang=>10, :lang_other=>11, :content=>12, :subject=>13, :contributor_behalf=>14, :character1_given_name=>15, :character1_family_name=>16, :character2_given_name=>17, :character2_family_name=>18, :date=>19, :date_from=>20, :date_to=>21, :location_placename=>22, :location_map=>23, :keywords=>24, :theatres=>25, :forces=>26, :editor_pick=>27, :cataloguer=>28, :collection_day=>29, :source=>30, :format=>31, :page_total=>32, :notes=>33, :file_type=>34, :license=>35, :creator=>36
  }
  NEW_ORDER = {
    :alternative=>1, :cover_image=>2, :page_number=>3, :object_side=>4, :creator_given_name=>5, :creator_family_name=>6, :description=>7, :summary=>8, :attachment_description=>9, :lang=>10, :lang_other=>11, :content=>12, :subject=>13, :contributor_behalf=>14, :character1_given_name=>15, :character1_family_name=>16, :character2_given_name=>17, :character2_family_name=>18, :date=>19, :date_from=>20, :date_to=>21, :location_placename=>22, :location_map=>23, :keywords=>24, :theatres=>25, :forces=>26, :editor_pick=>27, :cataloguer=>28, :collection_day=>29, :source=>30, :format=>31, :page_total=>32, :notes=>33, :file_type=>34, :license=>35, :creator=>36, :ticket=>37
  }
  
  def self.up
    MetadataField.create(:name => 'ticket', :field_type => 'string', :title => "Ticket number", :cataloguing => true, :contribution => true, :attachment => true, :searchable => false, :required => false, :show_in_listing => true)
    
    NEW_ORDER.each_pair do |name, position|
      MetadataField.find_by_name(name).update_attribute(:position, position)
    end
  end

  def self.down
    MetadataField.find_by_name('ticket').destroy
  
    OLD_ORDER.each_pair do |name, position|
      MetadataField.find_by_name(name).update_attribute(:position, position)
    end
  end
end
