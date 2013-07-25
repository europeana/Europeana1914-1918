##
# Contribution consisiting of files and metadata.
#
class Contribution < ActiveRecord::Base
  case RunCoCo.configuration.search_engine
  when :active_record
    include ContributionSearch::ActiveRecord
  when :solr
    include ContributionSearch::Solr
  when :sphinx
    include ContributionSearch::Sphinx
  end

  belongs_to :contributor, :class_name => 'User'
  belongs_to :cataloguer, :class_name => 'User', :foreign_key => 'catalogued_by'
  belongs_to :metadata, :class_name => 'MetadataRecord', :foreign_key => 'metadata_record_id', :dependent => :destroy
  #--
  # @fixme: Destroy associated contact when contribution destroyed, 
  # *IF* this is a guest contribution, *AND* there are no other associated 
  # contributions
  #++
  belongs_to :guest

  has_many :attachments, :class_name => '::Attachment', :dependent => :destroy, :include => :metadata do
    def with_file
      select { |attachment| attachment.file.present? }
    end

    def to_json(options = nil)
      proxy_owner.attachments.collect { |a| a.to_hash }.to_json(options)
    end
    
    def cover_image
      with_file.select { |attachment| attachment.metadata.field_cover_image.present? }.first || with_file.first
    end
  end
  
  has_many :statuses, :class_name => 'ContributionStatus', :dependent => :destroy, :order => 'created_at ASC'
  
  accepts_nested_attributes_for :metadata

  validates_presence_of :contributor_id, :if => Proc.new { RunCoCo.configuration.registration_required? }
  validates_presence_of :title
  validates_associated :metadata

  validate :validate_contributor_or_contact, :unless => Proc.new { RunCoCo.configuration.registration_required? }
  validate :validate_attachment_file_presence, :if => :submitting?
  validate :validate_cataloguer_role, :if => Proc.new { |c| c.catalogued_by.present? }

  attr_accessible :metadata_attributes, :title

  after_create :set_draft_status
  
  after_initialize :build_metadata_unless_present

  # Trigger syncing of public status of attachments to contribution's
  # published status.
  after_save do |c|
    c.attachments.each do |a|
      a.set_public
      a.save
    end
  end

  # Number of contributions to show per page when paginating
  cattr_reader :per_page
  @@per_page = 20

  def self.published
    where(:current_status => ContributionStatus.published)
  end

  def contact
    by_guest? ? guest : contributor.contact
  end
  
  def by_guest?
    contributor.blank?
  end

  ##
  # Returns a symbol representing this contribution's current status
  #
  # @return [Symbol] (see ContributionStatus#to_sym)
  #
  def status
    current_status.nil? ? nil : ContributionStatus.to_sym(current_status)
  end

  ##
  # Changes the contribution's current status to that specified
  #
  # Creates a new ContributionStatus record.
  #
  # If the status param is a symbol, is should be one of those returned by 
  # {ContributionStatus#to_sym}. If it is an integer, is should be one of the
  # status constants defined in ContributionStatus, e.g. 
  # {ContributionStatus::SUBMITTED}.
  #
  # @param [Symbol,Integer] The status to change this contribution to.
  #
  def change_status_to(status, user_id = nil)
    if status.is_a?(Symbol)
      status = ContributionStatus.const_get(status.to_s.upcase)
    end
    user_id ||= contributor_id

    status_record = ContributionStatus.create(:contribution_id => id, :user_id => user_id, :status => status)
    if status_record.id.present?
      self.current_status = status_record.status
      self.status_timestamp = status_record.created_at
      save
    else
      false
    end
  end

  ##
  # Submits the contribution for approval.
  #
  # Creates a {ContributionStatus} record with status = 
  # {ContributionStatus::SUBMITTED}.
  #
  # @return [Boolean] True if {ContributionStatus} record saved.
  #
  def submit
    @submitting = true
    if valid?
      change_status_to(:submitted)
    else
      false
    end
  end
  
  def submitting?
    @submitting == true
  end

  def submitted?
    status == :submitted
  end

  def ready_to_submit?
    if @ready_to_submit.nil?
      if !draft? || attachments.blank?
        @ready_to_submit = false
      else
        valid?
        validate_attachment_file_presence
        @ready_to_submit = self.errors.blank?
      end
    end
    @ready_to_submit
  end
  
  def draft?
    status == :draft
  end

  def approved?
    status == :approved
  end

  def approve_by(approver)
    metadata.cataloguing = true
    if valid?
      change_status_to(:approved, approver.id)
    else
      false
    end
  end
  
  def pending_approval?
    [ :submitted, :revised, :withdrawn ].include?(status)
  end
  
  def rejected?
    status == :rejected
  end

  def reject_by(rejecter)
    change_status_to(:rejected, rejecter.id)
  end
  
  def published?
    current_status == ContributionStatus.published
  end
  
  def validate_contributor_or_contact
    if self.contributor_id.blank? && self.guest_id.blank?
      self.errors.add(:guest_id, I18n.t('activerecord.errors.models.contribution.attributes.guest_id.present'))
    end
  end
  
  def validate_attachment_file_presence
    self.errors.add(:base, I18n.t('views.contributions.digital_object.help_text.add_attachment')) unless attachments.with_file.count == attachments.count
  end
  
  def validate_cataloguer_role
    self.errors.add(:catalogued_by, I18n.t('activerecord.errors.models.contribution.attributes.catalogued_by.role_name')) unless [ 'administrator', 'cataloguer' ].include?(User.find(catalogued_by).role_name)
  end
  
  alias :"rails_metadata_attributes=" :"metadata_attributes="
  def metadata_attributes=(*args)
    self.send(:"rails_metadata_attributes=", *args)
    self.metadata.for_contribution = true
  end
  
  alias :rails_build_metadata :build_metadata
  def build_metadata(*args)
    rails_build_metadata(*args)
    self.metadata.for_contribution = true
  end
  
  ##
  # Fetches and yields approved & published contributions for export.
  #
  # @example
  #   Contribution.export(:batch_size => 50) do |contribution|
  #     puts contribution.title
  #   end
  #
  # @param [Hash] options Export options
  # @option options [String] :exclude Exclude attachment records with files 
  #   having this extension
  # @option options [DateTime] :start_date only yield contributions published 
  #   on or after this date & time
  # @option options [DateTime] :end_date only yield contributions published on 
  #   or before this date & time
  # @option options [Integer] :batch_size (50) export in batches of this size; 
  #   passed to {#find_each}
  # @yieldreturn [Contribution] exported contributions
  #
  def self.export(options)
    options.assert_valid_keys(:exclude, :start_date, :end_date, :batch_size)
    options.reverse_merge!(:batch_size => 50)
    
    if options[:exclude].present?
      ext = options[:exclude].exclude
      unless ext[0] == '.'
        ext = '.' + ext
      end
    end
    
    conditions = [ 'current_status=?', ContributionStatus.published ]
    
    if options[:start_date].present?
      conditions[0] << ' AND status_timestamp >= ?'
      conditions << options[:start_date]
    end
    
    if options[:end_date].present?
      conditions[0] << ' AND status_timestamp <= ?'
      conditions << options[:end_date]
    end
    
    includes = [ 
      { :attachments => { :metadata => :taxonomy_terms } }, 
      { :metadata => :taxonomy_terms }, 
      { :contributor => :contact }
    ]
    
    Contribution.find_each(
      :conditions => conditions,
      :include => includes,
      :batch_size => options[:batch_size]
    ) do |contribution|
    
      if options[:exclude]
        contribution.attachments.reject! do |a|
          File.extname(a.file.path) == ext
        end
      end
    
      yield contribution
    end
  end
  
  ##
  # Converts the contribution's metadata to EDM
  #
  # @param [Hash] options Record generation options
  # @option options [Proc] :contribution_url Proc to generate contribution URL,
  #   passed the contribution as its parameter.
  # @option options [Proc] :attachment_url Proc to generate attachment URLs,
  #   passed the contribution and an attachment as its parameters.
  # @return (see MetadataRecord#to_edm)
  #
  def to_edm(options = {})
    metadata.to_edm.reverse_merge( {
      "providedCHOs" => [ { :about => options[:contribution_url].call(self) } ],
      "type" => "TEXT",
      "title" => [ title ],
      "dcDate" => { "def" => [ created_at ] },
      "dcIdentifier" => { "def" => [ id ] },
      "dcTitle" => { "def" => [ title ] },
      "dcType" => { "def" => [ "Text" ] },
      "dctermsCreated" => { "def" => [ created_at ] },
      "dctermsHasPart" => { "def" => attachments.collect { |attachment|
        options[:attachment_url].call(self, attachment)
      } },
      "edmType" => { "def" => [ "TEXT" ] }
    } )
  end
  
  ##
  # Returns a partial EDM record for the contribution, for use in search results.
  #
  # @param [Hash] options Record generation options
  # @option options [Proc] :contribution_url Proc to generate contribution URL,
  #   passed the contribution as its parameter.
  # @return [Hash] Partial EDM record for this contribution
  #
  def to_edm_result(options = {})
    root_url = options[:root_url].to_s
    root_url = root_url[0..-2] if root_url[-1] == '/'
    
    {
      "id"                  => id,
      "title"               => [ title ],
      "edmPreview"          => [ attachments.cover_image.thumbnail_url(:preview) ],
      "dctermsAlternative"  => [ metadata.fields['alternative'] ],
      "guid"                => options[:contribution_url].call(self)
    }
  end
  
  ##
  # Renders the contribution as RDF N-Triples
  #
  # @return [String]
  #
  def to_ntriples
    to_rdf_graph.dump(:ntriples)
  end
  
  ##
  # Constructs an RDF graph to represent the contribution and its metadata
  # as an ore:Aggregation of edm:ProvidedCHO and edm:WebResource.
  #
  # @return [RDF::Graph]
  #
  def to_rdf_graph
    graph = RDF::Graph.new
    meta = metadata.fields
    
    # edm:ProvidedCHO
    puri = RDF::URI.parse(edm_provided_cho_uri)
    
    graph << [ puri, RDF.type, RDF::EDM.ProvidedCHO ]
    graph << [ puri, RDF::DC.identifier, id.to_s ]
    graph << [ puri, RDF::DC.title, title ]
    graph << [ puri, RDF::DC.type, RDF::URI.parse("http://purl.org/dc/dcmitype/Text") ]
    graph << [ puri, RDF::DC.date, created_at.to_s ]
    graph << [ puri, RDF::DC.created, created_at.to_s ]
    graph << [ puri, RDF::EDM.type, "TEXT" ]
    
    contributor_full_name = meta["contributor_behalf"].present? ? meta["contributor_behalf"] : contributor.contact.full_name
    agent_properties = {}
    agent_properties['skos:prefLabel'] = contributor_full_name unless contributor_full_name.blank?
    unless agent_properties.blank?
      contributor_agent_uri = RDF::URI.parse("europeana19141918:agent/" + Digest::MD5.hexdigest(agent_properties.to_yaml))
      graph << [ contributor_agent_uri, RDF.type, RDF::EDM.Agent ]
      graph << [ contributor_agent_uri, RDF::SKOS.prefLabel, agent_properties['skos:prefLabel'] ] unless agent_properties['skos:prefLabel'].blank?
      graph << [ puri, RDF::DC.contributor, contributor_agent_uri ]
    end
    
    agent_properties = {}
    agent_properties['skos:prefLabel'] = meta["creator"] unless meta["creator"].blank?
    unless agent_properties.blank?
      creator_agent_uri = RDF::URI.parse("europeana19141918:agent/" + Digest::MD5.hexdigest(agent_properties.to_yaml))
      graph << [ creator_agent_uri, RDF.type, RDF::EDM.Agent ]
      graph << [ creator_agent_uri, RDF::SKOS.prefLabel, agent_properties['skos:prefLabel'] ] unless agent_properties['skos:prefLabel'].blank?
      graph << [ puri, RDF::DC.creator, creator_agent_uri ]
    end
    
    graph << [ puri, RDF::DC.description, meta["description"] ] unless meta["description"].blank?
    graph << [ puri, RDF::DC.description, meta["summary"] ] unless meta["summary"].blank?
    [ "keywords", "theatres", "forces" ].each do |subject_field|
      unless meta[subject_field].blank?
        meta[subject_field].each do |subject|
          concept_properties = {}
          concept_properties['skos:prefLabel'] = subject unless subject.blank?
          unless concept_properties.blank?
            subject_concept_uri = RDF::URI.parse("europeana19141918:concept/#{subject_field}/" + Digest::MD5.hexdigest(concept_properties.to_yaml))
            graph << [ subject_concept_uri, RDF.type, RDF::EDM.Concept ]
            graph << [ subject_concept_uri, RDF::SKOS.prefLabel, concept_properties['skos:prefLabel'] ]
            graph << [ puri, RDF::DC.subject, subject_concept_uri ]
          end
        end
      end
    end
    graph << [ puri, RDF::DC.subject, meta["subject"] ] unless meta["subject"].blank?
      
    character1_full_name = Contact.full_name(meta["character1_given_name"], meta["character1_family_name"])
    agent_properties = {}
    agent_properties['edm:begin'] = meta['character1_dob'] unless meta['character1_dob'].blank?
    agent_properties['edm:end'] = meta['character1_dod'] unless meta['character1_dod'].blank?
    agent_properties['skos:prefLabel'] = character1_full_name unless character1_full_name.blank?
    unless agent_properties.blank?
      subject_agent_uri = RDF::URI.parse("europeana19141918:agent/" + Digest::MD5.hexdigest(agent_properties.to_yaml))
      graph << [ subject_agent_uri, RDF.type, RDF::EDM.Agent ]
      graph << [ subject_agent_uri, RDF::EDM.begin, agent_properties['edm:begin'] ] unless agent_properties['edm:begin'].blank?
      graph << [ subject_agent_uri, RDF::EDM.end, agent_properties['edm:end'] ] unless agent_properties['edm:end'].blank?
      graph << [ subject_agent_uri, RDF::SKOS.prefLabel, agent_properties['skos:prefLabel'] ] unless agent_properties['skos:prefLabel'].blank?
      graph << [ puri, RDF::DC.subject, subject_agent_uri ]
    end
    
    graph << [ puri, RDF::DC.type, meta["content"].first ] unless meta["content"].blank?
    unless meta["lang"].blank?
      meta["lang"].each do |lang|
        graph << [ puri, RDF::DC.language, lang ]
      end
    end
    graph << [ puri, RDF::DC.language, meta["lang_other"] ] unless meta["lang_other"].blank?
    graph << [ puri, RDF::DC.alternative, meta["alternative"] ] unless meta["alternative"].blank?
    graph << [ puri, RDF::DC.provenance, meta["collection_day"].first ] unless meta["collection_day"].blank?
    
    lat, lng = meta["location_map"].split(',')
    place_properties = {}
    place_properties['wgs84_pos:lat'] = lat.to_f unless lat.blank?
    place_properties['wgs84_pos:lng'] = lng.to_f unless lng.blank?
    place_properties['skos:prefLabel'] = meta['location_placename'] unless meta['location_placename'].blank?
    unless place_properties.blank?
      spatial_place_uri = RDF::URI.parse('europeana19141918:place/' + Digest::MD5.hexdigest(place_properties.to_yaml))
      graph << [ spatial_place_uri, RDF.type, RDF::EDM.Place ]
      graph << [ spatial_place_uri, RDF::GEO.lat, place_properties['wgs84_pos:lat'] ] unless place_properties['wgs84_pos:lat'].blank?
      graph << [ spatial_place_uri, RDF::GEO.lng, place_properties['wgs84_pos:lng'] ] unless place_properties['wgs84_pos:lng'].blank?
      graph << [ spatial_place_uri, RDF::SKOS.prefLabel, place_properties['skos:prefLabel'] ] unless place_properties['skos:prefLabel'].blank?
      graph << [ puri, RDF::DC.spatial, spatial_place_uri ]
    end
    
    time_span_properties = {}
    time_span_properties['edm:begin'] = meta['date_from'] unless meta['date_from'].blank?
    time_span_properties['edm:end'] = meta['date_to'] unless meta['date_to'].blank?
    time_span_properties['skos:prefLabel'] = meta['date'] unless meta['date'].blank?
    unless time_span_properties.blank?
      temporal_time_span_uri = RDF::URI.parse('europeana19141918:timespan/' + Digest::MD5.hexdigest(time_span_properties.to_yaml))
      graph << [ temporal_time_span_uri, RDF.type, RDF::EDM.TimeSpan ]
      graph << [ temporal_time_span_uri, RDF::EDM.begin, meta['date_from'] ] unless meta["date_from"].blank?
      graph << [ temporal_time_span_uri, RDF::EDM.end, meta['date_to'] ] unless meta["date_to"].blank?
      graph << [ temporal_time_span_uri, RDF::SKOS.prefLabel, meta['date'] ] unless meta["date"].blank?
      graph << [ puri, RDF::DC.temporal, temporal_time_span_uri ]
    end
    
    attachments.each do |attachment|
      graph << [ puri, RDF::DC.hasPart, RDF::URI.parse(attachment.edm_provided_cho_uri) ]
    end
    
    # edm:WebResource
    wuri = RDF::URI.parse(edm_web_resource_uri)
    
    graph << [ wuri, RDF.type, RDF::EDM.WebResource ]
    graph << [ wuri, RDF::DC.description, created_at.to_s ]
    graph << [ wuri, RDF::DC.format, "TEXT" ]
    graph << [ wuri, RDF::DC.created, created_at.to_s ]
    graph << [ wuri, RDF::DC.created, meta["collection_day"].first ] unless meta["collection_day"].blank?
    graph << [ wuri, RDF::EDM.rights, RDF::URI.parse("http://creativecommons.org/publicdomain/zero/1.0/") ]
    
    # ore:Aggregation
    auri = RDF::URI.parse(ore_aggregation_uri)
    
    graph << [ auri, RDF.type, RDF::ORE.Aggregation ]
    graph << [ auri, RDF::EDM.aggregatedCHO, puri ]
    graph << [ auri, RDF::EDM.isShownAt, wuri ]
    graph << [ auri, RDF::EDM.isShownBy, wuri ]
    graph << [ auri, RDF::EDM.rights, RDF::URI.parse("http://creativecommons.org/publicdomain/zero/1.0/") ]
    
    graph
  end
  
  ##
  # The edm:ProvidedCHO URI of this contribution
  #
  # @return [String] URI
  #
  def edm_provided_cho_uri
    @edm_provided_cho_uri ||= RunCoCo.configuration.site_url + "/contributions/" + id.to_s
  end
  
  ##
  # The edm:WebResource URI of this contribution
  #
  # @return [String] URI
  #
  def edm_web_resource_uri
    @edm_web_resource_uri ||= RunCoCo.configuration.site_url + "/en/contributions/" + id.to_s
  end
  
  ##
  # The ore:Aggregation URI of this contribution
  #
  # @return [String] URI
  #
  def ore_aggregation_uri
    @ore_aggregation_uri ||= "europeana19141918:aggregation/contribution/" + id.to_s
  end
  
  protected
  def build_metadata_unless_present
    self.build_metadata unless self.metadata.present?
  end
  
  ##
  # Creates a {ContributionStatus} record with status = 
  # {ContributionStatus::DRAFT}
  #
  def set_draft_status
    change_status_to(:draft)
  end
end

