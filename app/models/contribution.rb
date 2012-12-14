# Contribution consisiting of files and metadata.
class Contribution < ActiveRecord::Base
  belongs_to :contributor, :class_name => 'User'
  belongs_to :cataloguer, :class_name => 'User', :foreign_key => 'catalogued_by'
  belongs_to :metadata, :class_name => 'MetadataRecord', :foreign_key => 'metadata_record_id', :dependent => :destroy
  #--
  # FIXME: Destroy associated contact when contribution destroyed, *IF* this is a guest contribution, *AND* there are no other associated contributions
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
      with_file.select { |attachment| attachment.metadata.fields['cover_image'].present? }.first || with_file.first
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

  # Dynamically define Sphinx search index.
  #
  # MetadataRecord columns equivalent to MetadataField records flagged
  # as searchable will be indexed.
  def self.set_search_index
    define_index_str = "define_index do\n"
    define_index_str << "  set_property :delta => true\n"
    define_index_str << "  indexes title, :sortable => true\n"
    define_index_str << "  indexes contributor.contact.full_name, :sortable => true, :as => :contributor\n"
    define_index_str << "  has contributor_id\n"
    define_index_str << "  has metadata_record_id\n"
    define_index_str << "  has created_at\n"
    define_index_str << "  has current_status, :as => :status\n"
    define_index_str << "  has status_timestamp\n"

    # Index all searchable taxonomy terms at once, on a single join
    define_index_str << "  indexes metadata.searchable_taxonomy_terms.term, :as => :taxonomy_terms\n"
    define_index_str << "  has metadata.searchable_taxonomy_terms(:id), :as => :taxonomy_term_ids\n"

    fields = MetadataField.where('(searchable = ? OR facet = ?) AND field_type <> ?', true, true, 'taxonomy')
    unless fields.count == 0
      fields.each do |field|
        index_alias = "metadata_#{field.name}"
        indexes_or_has = field.searchable? ? 'indexes' : 'has'
        facet = field.facet? ? 'true' : 'false'
        define_index_str << "  #{indexes_or_has} metadata.#{MetadataRecord.column_name(field.name)}, :sortable => true, :as => :#{index_alias}, :facet => #{facet}\n"
      end
    end
    
    define_index_str << "end\n"
    class_eval(define_index_str, __FILE__, __LINE__)
  end
  set_search_index

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
  # Outputs metadata record for OAI Dublin Core
  #
  # @see OaiProvider
  #
  def to_oai_dc
    xml = Builder::XmlMarkup.new
    xml.tag!("oai_dc:dc",
     'xmlns:oai_dc' => "http://www.openarchives.org/OAI/2.0/oai_dc/",
     'xmlns:dc' => "http://purl.org/dc/elements/1.1/",
     'xmlns:dcterms' => "http://purl.org/dc/terms/",
     'xmlns:xsi' => "http://www.w3.org/2001/XMLSchema-instance",
     'xsi:schemaLocation' =>
        %{http://www.openarchives.org/OAI/2.0/oai_dc/
          http://www.openarchives.org/OAI/2.0/oai_dc.xsd}) do
      xml.tag!('oai_dc:title', title)
      unless metadata.fields['description'].blank?
        xml.tag!('oai_dc:description', metadata.fields['description'])
      end
      if metadata.fields['contributor_behalf'].present?
        xml.tag!('oai_dc:contributor', metadata.fields['contributor_behalf'])
      else
        xml.tag!('oai_dc:contributor', contributor.contact.full_name)
      end
      unless metadata.fields['lang'].blank?
        metadata.fields['lang'].each do |lang|
          xml.tag!('oai_dc:language', lang)
        end
      end
      unless metadata.fields['lang_other'].blank?
        xml.tag!('oai_dc:language', metadata.fields['lang_other'])
      end
      unless metadata.fields['keywords'].blank?
        metadata.fields['keywords'].each do |keyword|
          xml.tag!('oai_dc:subject', keyword)
        end
      end
      unless metadata.fields['theatres'].blank?
        metadata.fields['theatres'].each do |theatre|
          xml.tag!('oai_dc:subject', theatre)
        end
      end
      unless metadata.fields['date_from'].blank? && metadata.fields['date_to'].blank?
        period = 'scheme=W3C-DTF;'
        period << (' start=' + metadata.fields['date_from'] + ';') unless metadata.fields['date_from'].blank?
        period << (' end=' + metadata.fields['date_to'] + ';') unless metadata.fields['date_to'].blank?
        xml.tag!('oai_dc:date', period, :'xsi:type' => "dcterms:Period")
      end
      unless (host = Rails.application.config.action_mailer.default_url_options[:host]).blank?
        port = Rails.application.config.action_mailer.default_url_options[:port]
        identifier = Rails.application.routes.url_helpers.root_url(:host => host, :port => port) + 'contributions/' + self.id.to_s
        xml.tag!('oai_dc:identifier', identifier, :'xsi:type' => "dcterms:URI")
      end
      xml.tag!('oai_dc:type', 'Text', :'xsi:type' => "dcterms:DCMIType")
      [ 'location_placename', 'location_map' ].each do |coverage|
        unless metadata.fields[coverage].blank?
          xml.tag!('oai_dc:coverage', metadata.fields[coverage])
        end
      end
    end
    xml.target!
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

