class CreateTaxonomyTermTranslationsTable < ActiveRecord::Migration
  def self.up
    TaxonomyTerm.create_translation_table!({
      :term => :string
    }, {
      :migrate_data => true
    })
  end

  def self.down
    TaxonomyTerm.drop_translation_table! :migrate_data => true
  end
end
