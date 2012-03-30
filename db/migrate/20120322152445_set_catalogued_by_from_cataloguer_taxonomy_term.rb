class SetCataloguedByFromCataloguerTaxonomyTerm < ActiveRecord::Migration
  class Contribution < ActiveRecord::Base
    belongs_to :metadata, :class_name => 'MetadataRecord', :foreign_key => 'metadata_record_id', :dependent => :destroy
  end
  class MetadataField < ActiveRecord::Base
    has_many :taxonomy_terms
  end
  class MetadataRecord < ActiveRecord::Base
    has_one :contribution
    has_and_belongs_to_many :taxonomy_terms
  end
  class TaxonomyTerm < ActiveRecord::Base
    has_and_belongs_to_many :metadata_records
    belongs_to :metadata_field
  end
  class User < ActiveRecord::Base
    belongs_to :contact, :dependent => :destroy
  end
  class Contact < ActiveRecord::Base
    has_one :user
    has_many :contributions, :foreign_key => 'contributor_id'
  end
  def self.up
    set_count = 0
    
    contributions = Contribution.scoped.joins({ :metadata => { :taxonomy_terms => :metadata_field } })
    contributions = contributions.where('metadata_fields.name = ?', 'cataloguer')
    contributions = contributions.where('catalogued_by IS NULL')
    
    cataloguer_users = {}
    User.where(:role_name => [ 'administrator', 'cataloguer' ]).includes(:contact).each do |user|
      cataloguer_users[user.id] = user.contact.full_name
    end
    cataloguer_users.merge!( {
      37  => "Frank Drauschke",
      43  => "Stephen Bull",
      292 => "Imke W",
      796 => "Other",
      994 => "Ciara Boylan",
      973 => "Liz Danskin",
      1379 => "Everett Sharp",
    } )
    
    say_with_time "Setting `contributions`.`catalogued_by` values from cataloguer taxonomy" do
      cataloguer_users.each_pair do |user_id, cataloguer_term|
        updates = { :catalogued_by => user_id }
        conditions = [ 'taxonomy_terms.term = ?', cataloguer_term ]
        delta = contributions.update_all(updates, conditions)
        set_count = set_count + delta
      end
    end

    say "Set #{set_count} `contributions`.`catalogued_by` values from cataloguer taxonomy"
    
    unset_contributions = contributions.where('taxonomy_terms.term IS NOT NULL')
    unset_count = unset_contributions.count
    if unset_count > 0
      unset_cataloguers = unset_contributions.collect { |c| c.metadata.fields['cataloguer'] }.flatten.uniq.join(', ')
      say "#{unset_count} contributions remain with unknown cataloguer taxonomy terms: #{unset_cataloguers}"
    end
  end

  def self.down
    say_with_time "Nullifying all `contributions`.`catalogued_by` values" do
      Contribution.update_all('catalogued_by = NULL')
    end 
  end
end
