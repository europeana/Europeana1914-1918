# encoding: UTF-8
class AddRomanianToLangMetadataField < ActiveRecord::Migration
  def self.up
    if mf = MetadataField.find_by_name("lang")
      tt = TaxonomyTerm.new(:term => "Română")
      mf.taxonomy_terms << tt
    end
  end

  def self.down
    if mf = MetadataField.find_by_name("lang")
      if tt = mf.taxonomy_terms.find_by_term("Română")
        tt.destroy
      end
    end
  end
end
