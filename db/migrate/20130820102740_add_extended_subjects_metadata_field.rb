# encoding: UTF-8
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
    
    [
      "Guerre mondiale (1914-1918) -- France -- Alsace (France)",
      "Guerre mondiale (1914-1918) -- Participation coloniale",
      "Guerre mondiale (1914-1918) -- Grande-Bretagne",
      "Guerre mondiale (1914-1918) -- Italie",
      "Guerre mondiale (1914-1918) -- France",
      "Poilus (Guerre mondiale, 1914-1918)",
      "Guerre mondiale (1914-1918) -- Aspect religieux -- Église catholique"
    ].each do |subject|
      tt = TaxonomyTerm.new(:term => subject)
      mf.taxonomy_terms << tt
    end
  end

  def self.down
    if mf = MetadataField.find_by_name("extended_subjects")
      mf.destroy
    end
  end
end
