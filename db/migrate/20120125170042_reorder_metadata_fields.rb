class ReorderMetadataFields < ActiveRecord::Migration
  OLD_ORDER = {
    :cataloguer=>1, :alternative=>2, :contributor_behalf=>3, :date=>4, :date_from=>5, :date_to=>6, :location_placename=>7, :location_map=>8, :description=>9, :creator=>10, :subject=>11, :file_type=>12, :source=>13, :format=>14, :content=>15, :page_number=>16, :page_total=>17, :editor_pick=>18, :notes=>19, :lang=>20, :lang_other=>21, :keywords=>22, :forces=>23, :theatres=>24, :collection_day=>25
  }
  NEW_ORDER = {
    :alternative=>1, :page_number=>2, :description=>3, :lang=>4, :lang_other=>5, :content=>6, :subject=>7, :contributor_behalf=>8, :date=>9, :date_from=>10, :date_to=>11, :location_placename=>12, :location_map=>13, :keywords=>14, :theatres=>15, :forces=>16, :editor_pick=>17, :cataloguer=>18, :collection_day=>19, :source=>20, :format=>21, :page_total=>22, :notes=>23, :file_type=>24, :creator=>25
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
