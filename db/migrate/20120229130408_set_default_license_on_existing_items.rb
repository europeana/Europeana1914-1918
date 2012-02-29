class SetDefaultLicenseOnExistingItems < ActiveRecord::Migration
  def self.up
    say_with_time "Setting default license on existing attachment metadata records" do
      if field = MetadataField.find_by_name('license')
        if term = TaxonomyTerm.where(:metadata_field_id => field.id, :term => 'http://creativecommons.org/licenses/by-sa/3.0/')
          Attachment.find_each do |attachment|
            if attachment.metadata.field_license_terms.blank?
              attachment.metadata.field_license_terms << term
            end
          end
        else
          say "CC-BY-SA term not found; skipping."
        end        
      else
        say "License metadata field not found; skipping."
      end
    end
  end

  def self.down
    say "No way to rollback this migration without potentially affecting other attachment metadata records."
  end
end
