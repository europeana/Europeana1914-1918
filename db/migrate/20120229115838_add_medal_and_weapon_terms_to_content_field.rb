class AddMedalAndWeaponTermsToContentField < ActiveRecord::Migration
  TERMS = [ 'Medal', 'Weapon' ]

  def self.up
    say_with_time "Adding medal and weapon terms to content field" do
      if field = MetadataField.find_by_name('content')
        TERMS.each do |term|
          field.taxonomy_terms << TaxonomyTerm.create(:term => term)
        end
      else
        say "Content metadata field not found; skipping."
      end
    end
  end

  def self.down
    say_with_time "Removing medal and weapon terms from content field" do
      if field = MetadataField.find_by_name('content')
        TERMS.each do |term|
          if term = TaxonomyTerm.where(:metadata_field_id => field.id, :term => term).first
            term.destroy
          end
        end
      else
        say "Content metadata field not found; skipping."
      end
    end
  end
end
