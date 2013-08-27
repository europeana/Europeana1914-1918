class AddExtendedSubjectsMetadataField < ActiveRecord::Migration
  def self.up
    mf = MetadataField.create!(
      :title => "Extended subjects",
      :field_type => "taxonomy",
      :required => false,
      :name => "extended_subjects",
      :cataloguing => true,
      :searchable => true,
      :multi => true,
      :show_in_listing => false,
      :contribution => true,
      :attachment => true,
      :facet => false
    )
  end

  def self.down
    if mf = MetadataField.find_by_name("extended_subjects")
      mf.destroy
    end
  end
end
