class ChangeLicenseFieldTermsToUrls < ActiveRecord::Migration
  MAP = { 
    'cc-by-sa'      => 'http://creativecommons.org/licenses/by-sa/3.0/',
    'public domain' => 'http://creativecommons.org/publicdomain/mark/1.0/',
  }
  
  def self.up
    say_with_time "Changing license field terms to CC URLs" do
      if field = MetadataField.find_by_name('license')
        MAP.each_pair do |abbr, url|
          if term = TaxonomyTerm.where(:metadata_field_id => field.id, :term => abbr).first
            term.update_attribute(:term, url)
          end
        end
      else
        say "License metadata field not found; skipping."
      end
    end
  end

  def self.down
    say_with_time "Reverting license field terms to CC abbrs" do
      if field = MetadataField.find_by_name('license')
        MAP.each_pair do |abbr, url|
          if term = TaxonomyTerm.where(:metadata_field_id => field.id, :term => url).first
            term.update_attribute(:term, abbr)
          end
        end
      else
        say "License metadata field not found; skipping."
      end
    end
  end
end
