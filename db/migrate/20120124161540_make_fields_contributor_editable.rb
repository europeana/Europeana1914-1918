class MakeFieldsContributorEditable < ActiveRecord::Migration
  FIELDS = [ :date_from, :date_to, :keywords, :theatres, :page_number, :content, :subject ]
  def self.up
    FIELDS.each do |name|
      MetadataField.find_by_name(name).update_attribute(:cataloguing, false)
    end
  end

  def self.down
    FIELDS.each do |name|
      MetadataField.find_by_name(name).update_attribute(:cataloguing, true)
    end
  end
end
