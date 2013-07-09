class DefaultTaxonomyTermsToEnglishTranslation < ActiveRecord::Migration
  def self.up
    TaxonomyTerm.connection.select_all("SELECT tt.id, tt.term, tr.term en_term FROM taxonomy_terms tt INNER JOIN taxonomy_term_translations tr ON tt.id=tr.taxonomy_term_id WHERE tr.locale='en'").each do |row|
      tt = TaxonomyTerm.find(row['id'])
      if tt
        tt.update_attribute(:term, row['en_term'])
      end
    end
  end

  def self.down
  end
end
