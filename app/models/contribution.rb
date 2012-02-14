# Contribution consisiting of files and metadata.
class Contribution < ActiveRecord::Base
  belongs_to :contributor, :class_name => 'User'
  belongs_to :approver, :class_name => 'User', :foreign_key => 'approved_by'
  belongs_to :metadata, :class_name => 'MetadataRecord', :foreign_key => 'metadata_record_id', :dependent => :destroy
  #--
  # FIXME: Destroy associated contact when contribution destroyed, *IF* this is a guest contribution, *AND* there are no other associated contributions
  #++
  belongs_to :guest

  has_many :attachments, :class_name => '::Attachment', :dependent => :destroy, :include => :metadata do
    def with_file
      select { |attachment| attachment.file.present? }
    end
  end
  
  accepts_nested_attributes_for :metadata

  validates_presence_of :contributor_id, :if => Proc.new { RunCoCo.configuration.registration_required? }
  validate :validate_contributor_or_contact, :unless => Proc.new { RunCoCo.configuration.registration_required? }
  validates_presence_of :title
  validates_associated :metadata
  validates_acceptance_of :terms, :allow_nil => false, :accept => true, :if => :submitting?
  validate :validate_attachment_file_presence, :if => :submitting?

  attr_accessible :metadata_attributes, :title

  before_save :set_published_at
  
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
    define_index_str << "  indexes title\n"
    define_index_str << "  has approved_at\n"
    define_index_str << "  has submitted_at\n"
    define_index_str << "  has published_at\n"

    searchable_fields = MetadataField.where('searchable = ? AND field_type <> ?', true, 'taxonomy')
    unless searchable_fields.count == 0
      searchable_fields.each do |field|
        index_alias = "metadata_#{field.name}"
        define_index_str << "  indexes metadata.#{MetadataRecord.column_name(field.name)}, :as => :#{index_alias}\n"
      end
    end
    
    define_index_str << "end\n"
    
    class_eval(define_index_str, __FILE__, __LINE__)
  end
  set_search_index

  def contact
    by_guest? ? guest : contributor.contact
  end
  
  def by_guest?
    contributor.blank?
  end

  ##
  # Submits the contribution for approval.
  #
  # Sets {@submitted_at} to the current time and saves to the database. Returns
  # the result of {#save}.
  #
  # @return [Boolean]
  def submit
    self.submitted_at = Time.zone.now
    self.save
  end
  
  def submitting?
    self.submitted_at.present? && self.submitted_at_changed?
  end

  def submitted?
    self.submitted_at != nil
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
    !self.submitted?
  end

  def approved?
    self.approved_at != nil
  end
  
  def approve_by(approver)
    self.approver = approver
    self.approved_at = Time.zone.now
    self.save
  end
  
  def published?
    self.published_at != nil
  end
  
  # Derives and sets the value of the published_at attribute.
  # 
  # The publication time will be:
  # * nil if contributions are not to be made public at all;
  # * the time the contribution was approved if approval is required;
  # * the time the contribution was submitted if approval is not
  #   required
  def set_published_at #:nodoc:
    self.published_at = (
      RunCoCo.configuration.publish_contributions ? 
      ( RunCoCo.configuration.contribution_approval_required ? self.approved_at : self.submitted_at) :
      nil
    )
    true
  end

  def validate_contributor_or_contact
    if self.contributor_id.blank? && self.guest_id.blank?
      self.errors.add(:guest_id, I18n.t('activerecord.errors.models.contribution.attributes.guest_id.present'))
    end
  end
  
  def validate_attachment_file_presence
    self.errors.add(:base, I18n.t('views.contributions.digital_object.help_text.add_attachment')) unless attachments.with_file.count == attachments.count
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
  
  protected
  def build_metadata_unless_present
    self.build_metadata unless self.metadata.present?
  end
end

