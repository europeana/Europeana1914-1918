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
  
  class << self
    alias_method :engine_search, :search
  end

  ##
  # Search contributions.
  #
  # Uses ThinkingSphinx if available. If not, falls back to a simple
  # non-indexed SQL query.
  #
  # With ThinkingSphinx, this will search against contribution titles and
  # any metadata fields flagged as searchable. The SQL fallback will only 
  # search the contribution titles. 
  #
  # If query param is +nil+, returns all contributions, unless other search
  # conditions given in options param.
  #
  # @param [Symbol] set Which set of contributions to search. Valid values:
  #   * +:approved+
  #   * +:submitted+
  #   * +:published+
  #   * +:draft+
  #   * +:rejected+
  #
  # @param [String] query The full-text query to pass to the search engine.
  #   Defaults to +nil+, returning all contributions in the named set.
  #
  # @param [Hash] options Search options
  # @option options [Integer,String] :contributor_id Only return results from
  #   the contributor with this ID.
  # @option options [TaxonomyTerm] :taxonomy_term Only return results
  #   categorised with this taxonomy term.
  # @option options [Integer,String] :page Number of page of results to return.
  # @option options [Integer,String] :per_page Number of results to return per 
  #   page.
  # @option options [String] :order Direction to order the results: 'ASC' or 
  #   'DESC'. Default is 'ASC' provided +sort+ param also present, otherwise
  #   set-specific.
  # @option options [String] :sort Column to sort on, e.g. 'created_at'. 
  #   Default is set-specific.
  # @option options Any other options valid for ThinkingSphinx or ActiveRecord 
  #   queries.
  #
  # @return [Array<Contribution>] Search results
  #
  # @see http://freelancing-god.github.com/ts/en/searching.html ThinkingSphinx 
  #   search options
  #
  def self.search(set, query = nil, options = {})
    raise ArgumentError, "set should be :draft, :submitted, :approved, :revised, :rejected, :withdrawn or :published, got #{set.inspect}" unless [ :draft, :submitted, :approved, :published, :revised, :rejected, :withdrawn ].include?(set)
    
    if ThinkingSphinx.sphinx_running?
      sphinx_search(set, query, options)
    else
      activerecord_search(set, query, options)
    end
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
  
  ##
  # Simple text query against contributions.
  #
  # Intended for use as:
  # - a backup if no other engine is available
  # - a lightweight alternative when queries are only on indexed attributes, 
  #   i.e. not full text
  #
  # @param (see #search)
  # @return (see #search)
  #
  def self.activerecord_search(set, query = nil, options = {}) # :nodoc:
    options = options.dup
    
    set_where = if set.nil?
      1
    elsif set == :published
      [ 'current_status=?', ContributionStatus.published ]
    else
      [ 'current_status=?', ContributionStatus.const_get(set.to_s.upcase) ]
    end
    
    query_where = if query.blank?
      nil
    elsif query.is_a?(Hash)
      query_translations = query.dup
      query_translations[I18n.locale] = query_translations[I18n.locale].add_quote_marks('%')
      query_translations = query_translations.values.uniq
      [ query_translations.collect { |qt| 'title LIKE ?' }.join(' OR ') ] + query_translations
    else
      [ 'title LIKE ?', query.add_quote_marks('%') ]
    end
    
    metadata_joins = []
    joins = [ ]
    if (sort = options.delete(:sort)).present?
      if MetadataRecord.taxonomy_associations.include?(sort.to_sym)
        sort_col = "taxonomy_terms.term"
        metadata_joins << sort.to_sym
      elsif sort == 'contributor'
        sort_col = "contacts.full_name"
        joins << { :contributor => :contact }
      else
        sort_col = sort
      end

      order = options.delete(:order)
      order = (order.present? && [ 'DESC', 'ASC' ].include?(order.upcase)) ? order : 'ASC'
      
      sort_order = "#{sort_col} #{order}"
    else
      if set == :submitted
        options[:order] = 'status_timestamp ASC'
      else
        options[:order] = 'status_timestamp DESC'
      end
    end
    
    contributor_id = options.delete(:contributor_id)
    contributor_where = contributor_id.present? ? { :contributor_id => contributor_id } : nil
    
    taxonomy_term = options.delete(:taxonomy_term)
    if taxonomy_term.present?
      taxonomy_field_alias = taxonomy_term.metadata_field.collection_id
      metadata_joins << taxonomy_field_alias
      if sort_col == "taxonomy_terms.term"
        taxonomy_term_where = { "#{taxonomy_field_alias}.id" => taxonomy_term.id }
      else
        taxonomy_term_where = { "taxonomy_terms.id" => taxonomy_term.id }
      end
    else
      taxonomy_term_where = nil
    end
    
    joins << { :metadata => metadata_joins }
    
    results = joins(joins).where(set_where).where(query_where).where(contributor_where).where(taxonomy_term_where).order(sort_order)
      
    if options.has_key?(:page)
      results = results.paginate(options)
    end
    
    results
  end
  
  ##
  # Searches contributions using Sphinx.
  #
  # Always does word-end wildcard queries by appending * to query if not already
  # present.
  #
  # @param (see #search)
  # @return (see #search)
  #
  def self.sphinx_search(set, query = nil, options = {}) # :nodoc:
    unless ThinkingSphinx.sphinx_running?
      raise RunCoCo::SearchOffline
    end
    
    options = options.dup.reverse_merge(:max_matches => ThinkingSphinx::Configuration.instance.client.max_matches)
    
    status_option = if (set == :published)
      { :with => { :status => ContributionStatus.published } }
    else
      { :with => { :status => ContributionStatus.const_get(set.to_s.upcase) } }
    end
    
    options.merge!(status_option)
    
    order = options[:order].present? && [ :desc, :asc ].include?(options[:order].downcase.to_sym) ? options.delete(:order).downcase.to_sym : :asc
    
    if sort = options.delete(:sort)
      if MetadataRecord.taxonomy_associations.include?(sort.to_sym)
        sort_col = nil
      elsif sort =~ /^field_/
        # Convert field name to index alias
        sort_col = sort.sub(/^field_/, 'metadata_')
      else
        sort_col = sort
      end
      
      options[:sort_mode] = order
      options[:order] = sort_col
    else
      if set == :submitted
        options[:order] = 'status_timestamp ASC'
      else
        options[:order] = 'status_timestamp DESC'
      end
    end
    
    contributor_id = options.delete(:contributor_id)
    if contributor_id.present?
      options[:with][:contributor_id] = contributor_id
    end
    
    taxonomy_term = options.delete(:taxonomy_term)
    if taxonomy_term.present?
      options[:with][:taxonomy_term_ids] = taxonomy_term.id
    end
    
    if query.blank?
      Contribution.engine_search(options)
    else
      if query.is_a?(Hash)
        query_translations = query.dup
        options[:match_mode] = :extended
        query_translations[I18n.locale] = query_translations[I18n.locale].append_wildcard
        query_translations = query_translations.values.uniq
        query_string = query_translations.add_quote_marks.join(' | ')
      else
        query_string = query.append_wildcard
      end
      Contribution.engine_search(query_string, options)
    end
  end
end

