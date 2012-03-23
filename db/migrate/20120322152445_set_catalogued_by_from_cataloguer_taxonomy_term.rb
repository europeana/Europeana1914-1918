class SetCataloguedByFromCataloguerTaxonomyTerm < ActiveRecord::Migration
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
    } )
    
    say_with_time "Setting `contributions`.`catalogued_by` values from cataloguer taxonomy" do
      cataloguer_users.each_pair do |user_id, cataloguer_term|
        updates = { :catalogued_by => user_id }
        conditions = [ 'taxonomy_terms.term = ?', cataloguer_term ]
        delta = contributions.update_all(updates, conditions)
        set_count = set_count + delta
      end
    end
    
    unset_count = contributions.where('taxonomy_terms.term IS NOT NULL').count
    
    say "Set #{set_count} `contributions`.`catalogued_by` values from cataloguer taxonomy"
    say "#{unset_count} contributions remain with unknown cataloguer taxonomy terms"
  end

  def self.down
    say_with_time "Nullifying all `contributions`.`catalogued_by` values" do
      Contribution.update_all('catalogued_by = NULL')
    end 
  end
end
