# Cataloguer metadata field redundant since introduction of 
# contributions.catalogued_by foreign key pointing to cataloguer's user account
class DeleteCataloguerMetadataField < ActiveRecord::Migration
  class MetadataField < ActiveRecord::Base
    has_many :taxonomy_terms, :order => 'term ASC', :dependent => :destroy
  end

  class TaxonomyTerm < ActiveRecord::Base
    belongs_to :metadata_field
    has_and_belongs_to_many :metadata_records
  end
  
  class MetadataRecord < ActiveRecord::Base
    has_and_belongs_to_many :taxonomy_terms
  end

  def self.up
    MetadataField.find_by_name("cataloguer").destroy
  end

  def self.down
    MetadataField.create(:title => "Cataloguer", :field_type => "taxonomy", :required => false, :name => "cataloguer", :cataloguing => true, :searchable => false,  :hint => "Select your name from the list", :multi => false, :show_in_listing => false, :contribution => true, :attachment => false, :facet => false)
  end
end
