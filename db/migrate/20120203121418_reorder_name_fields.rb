class ReorderNameFields < ActiveRecord::Migration
  OLD_ORDER = {
    :alternative=>1, :cover_image=>2, :page_number=>3, :object_side=>4, :creator_family_name=>5, :creator_given_name=>6, :description=>7, :attachment_description=>8, :lang=>9, :lang_other=>10, :content=>11, :subject=>12, :contributor_behalf=>13, :character1_family_name=>14, :character1_given_name=>15, :character2_family_name=>16, :character2_given_name=>17, :date=>18, :date_from=>19, :date_to=>20, :location_placename=>21, :location_map=>22, :keywords=>23, :theatres=>24, :forces=>25, :editor_pick=>26, :cataloguer=>27, :collection_day=>28, :source=>29, :format=>30, :page_total=>31, :notes=>32, :file_type=>33, :license=>34, :creator=>35
  }
  NEW_ORDER = {
    :alternative=>1, :cover_image=>2, :page_number=>3, :object_side=>4, :creator_given_name=>5, :creator_family_name=>6, :description=>7, :attachment_description=>8, :lang=>9, :lang_other=>10, :content=>11, :subject=>12, :contributor_behalf=>13, :character1_given_name=>14, :character1_family_name=>15, :character2_given_name=>16, :character2_family_name=>17, :date=>18, :date_from=>19, :date_to=>20, :location_placename=>21, :location_map=>22, :keywords=>23, :theatres=>24, :forces=>25, :editor_pick=>26, :cataloguer=>27, :collection_day=>28, :source=>29, :format=>30, :page_total=>31, :notes=>32, :file_type=>33, :license=>34, :creator=>35
  }

  def self.up
    NEW_ORDER.each_pair do |name, position|
      MetadataField.find_by_name(name).update_attribute(:position, position)
    end
  end

  def self.down
    OLD_ORDER.each_pair do |name, position|
      MetadataField.find_by_name(name).update_attribute(:position, position)
    end
  end
end
