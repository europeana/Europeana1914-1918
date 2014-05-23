class AddFlickrAttributionShareAlikeLicense < ActiveRecord::Migration
  LICENSE = 'https://creativecommons.org/licenses/by-sa/2.0/'
  
  def up
    if mf = MetadataField.find_by_name('license')
      unless mf.taxonomy_terms.find_by_term(LICENSE)
        mf.taxonomy_terms << TaxonomyTerm.new(:term => LICENSE)
      end
    end
  end

  def down
    if mf = MetadataField.find_by_name('license')
      if tt = mf.taxonomy_terms.find_by_term(LICENSE)
        tt.destroy
      end
    end
  end
end
