##
# Model storing records harvested from the Europeana API
#
# @see http://www.europeana.eu/portal/api-record-json.html
#
class EuropeanaRecord < ActiveRecord::Base
  serialize :object
  
  validates_uniqueness_of :record_id
  validates_presence_of :record_id, :object
  
  # Solr index
  searchable do
    text :title do
      object['title']
    end
    
    text :taxonomy_terms do
      if object.has_key?('concepts')
        object['concepts'].collect { |concept| concept['prefLabel'].collect { |code, labels| labels } }.flatten
      else
        nil
      end
    end
    
    string :year, :multiple => true do
      years = [ ]
      object['proxies'].each do |proxy|
        if proxy['year'] && proxy['year']['eur']
          years = years + proxy['year']['eur']
        end
      end
      years.flatten.uniq
    end
    
    string :type do
      object['type']
    end
    
    string :provider, :multiple => true do
      provider
    end
    
    string :data_provider, :multiple => true do
      data_provider
    end
    
    string :country, :multiple => true do
      country
    end
    
    string :rights, :multiple => true do
      rights
    end
    
    # Harvested Europeana records are always "approved"
    integer :current_status do
      ContributionStatus::APPROVED
    end
  end
  
  def rights
    unless object['aggregations'].first['edmRights'].blank?
      object['aggregations'].first['edmRights']['def']
    end
  end
  
  def country
    unless object['europeanaAggregation'].blank? || object['europeanaAggregation']['edmCountry'].blank?
      object['europeanaAggregation']['edmCountry']['def']
    end
  end
  
  def provider
    unless object['aggregations'].first['edmProvider'].blank?
      object['aggregations'].first['edmProvider']['def']
    end
  end
  
  def data_provider
    unless object['aggregations'].first['edmDataProvider'].blank?
      object['aggregations'].first['edmDataProvider']['def']
    end
  end
  
  def dc_creator
    unless object['proxies'].first['dcCreator'].blank?
      object['proxies'].first['dcCreator']['def']
    end
  end
  
  ##
  # Returns an extract of the object data modelled after Europeana API search
  #   result items.
  #
  # @return [Hash]
  #
  def to_edm_result
    {
      'title' => object['title'],
      'id' => object['about'],
      'year' => object['year'],
      'provider' => provider,
      'dataProvider' => data_provider,
      'dcCreator' => dc_creator,
      'edmPreview' => object['europeanaAggregation'] ? [ object['europeanaAggregation']['edmPreview'] ] : nil
    }
  end
end
