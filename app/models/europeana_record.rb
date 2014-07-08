##
# Model storing records harvested from the Europeana API
#
# @see http://www.europeana.eu/portal/api-record-json.html
#
class EuropeanaRecord < ActiveRecord::Base
  serialize :object
  
  validates_uniqueness_of :record_id
  validates_presence_of :record_id, :object
  
  before_validation :harvest_object, :on => :create
  after_save :expire_cache_fragments, :on => :update
  after_destroy :expire_cache_fragments
  
  # @see ActsAsTaggableOn
  acts_as_taggable
  
  has_many :annotations, :as => :annotatable, :dependent => :destroy
  
  # Solr index
  searchable do
    fulltext_fields = { 
      'proxies' => [ 
        'dcDescription', 'dcCreator', 'dcType', 'dcFormat', 'dcSubject', 
        'dcDate', 'dcCoverage', 'dcRights', 'dcTitle', 'dcSource', 'dcRelation',
        'dcContributor'
      ],
      'aggregations' => [
        'edmDataProvider',
        'edmProvider'
      ],
      'europeanaAggregation' => [
        'edmCountry'
      ]
    }
      
    fulltext_fields.each_pair do |key, fields|
      fields.each do |field|
        text field.to_sym do
          fulltext_value = nil
          if object[key].present?
            fulltext_value = [ object[key] ].flatten.collect do |edm_object|
              if edm_object[field]
                edm_object[field].values
              end
            end.flatten.uniq
          end
          fulltext_value
        end
        text "#{field}_mlt".to_sym, :more_like_this => true do
          fulltext_value = nil
          if object[key].present?
            fulltext_value = [ object[key] ].flatten.collect do |edm_object|
              if edm_object[field]
                edm_object[field].values
              end
            end.flatten.uniq
          end
          fulltext_value
        end
      end
    end
    
    text :taxonomy_terms do
      if object.has_key?('concepts')
        object['concepts'].collect do |concept|
          concept.has_key?('prefLabel') ? concept['prefLabel'].collect { |code, labels| labels } : []
        end.flatten
      else
        nil
      end
    end
    text :taxonomy_terms_mlt, :more_like_this => true do
      if object.has_key?('concepts')
        object['concepts'].collect do |concept|
          concept.has_key?('prefLabel') ? concept['prefLabel'].collect { |code, labels| labels } : []
        end.flatten
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
    
    # URIs of skos:Concept elements
    string :uri, :multiple => true do
      uri
    end
    
    # Harvested Europeana records are always "approved"
    string :status do
      'approved'
    end
    
    integer :contributor_id do
      nil
    end
    
    integer :tag_ids, :multiple => true do 
      visible_tags.collect(&:id)
    end
    text :tags do
      visible_tags.collect(&:name)
    end
    text :tags_mlt, :more_like_this => true do
      visible_tags.collect(&:name)
    end
    
    text :annotations do
      visible_annotations.collect(&:text)
    end
  end
  
  def title
    object['title'].join('; ')
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
  
  def uri
    unless object['concepts'].blank?
      object['concepts'].select { |concept| concept['about'].match("http://data.europeana.eu/concept/loc") }.collect { |concept| concept['about'] }
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
  
  ##
  # Gets the object data for this record from the Europeana portal
  #
  def harvest_object
    retries = 5
    begin
      self.object = Europeana.record(self.record_id)['object']
    rescue Europeana::Errors::RequestError => error
      if error.message.match('"Unable to parse the API response."')
        retries -= 1
        raise unless retries > 0
        sleep 10
        retry
      end
      raise unless error.message.match('"Invalid record identifier: ') # ignore these
    end
  end
  
  def expire_cache_fragments
    fragments = [
      "europeana_records/edm/result/#{id}"
    ]
    
    fragments.each do |key|
      ActionController::Base.new.expire_fragment(key)
    end
  end
    
  def dataset_id
    record_id.split('/')[1]
  end
  
  def provider_record_id
    record_id.split('/')[2]
  end
  
  def to_param
    record_id[1..-1]
  end
  
  ##
  # Returns the tags on this contribution that are visible to all users.
  #
  # Visible tags are those where the tagging currently has the status:
  # published, flagged or revised
  #
  # @return [Array<ActsAsTaggableOn::Tag>] Visible tags
  # @see ActsAsTaggableOn
  #
  def visible_tags
    taggings.with_status(:published, :flagged, :revised).where(:context => 'tags').collect(&:tag)
  end
  
  # @see Attachment#visible_annotations
  def visible_annotations
    annotations.with_status(:published, :flagged, :revised)
  end
end
