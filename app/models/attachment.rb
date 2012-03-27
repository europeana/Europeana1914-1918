##
# A file accompanying a contribution.
#
# Uses Paperclip to store file uploads. See Paperclip docs at
# <http://github.com/thoughtbot/paperclip>.
#
# When referring to this class, use ::Attachment to distinguish from
# Paperclip's internal Attachment class.
#
# Attributes:
# * title: Optional attachment title
# * file: Attached file (as a Paperclip attachment).
# * metadata: Associated metadata record
# 
# Files may be stored in one of two paths, dependent on the public
# attribute. If public is true, they will be stored in the app's public
# directory. If public is false, they will be stored in the private
# directory instead. Files in public will be served by the web server
# directly, for better performance. Files in private will need to be
# served by a controller, allowing for access control.
class Attachment < ActiveRecord::Base
  belongs_to :contribution
  belongs_to :metadata, :class_name => 'MetadataRecord', :foreign_key => 'metadata_record_id', :dependent => :destroy
  accepts_nested_attributes_for :metadata
  
  attr_accessible :title, :file, :metadata_attributes

  # Custom Paperclip interpolations for has_attached_file
  
  # :contribution_id => ID of associated contribution
  Paperclip.interpolates :contribution_id do |attachment, style|
    attachment.instance.contribution_id
  end
  
  # :env_file_root => Base directory for all attachments
  #
  # For test & cucumber environments, files saved beneath Rails' "tmp"
  # dir. For other environments, files saved beneath Rails root.
  Paperclip.interpolates :env_file_root do |attachment, style|
    [ 'test', 'cucumber' ].include?(Rails.env) ? "#{Rails.root}/tmp/#{Rails.env}" : Rails.root
  end
  
  # :access_dir => Sub-directory to store all attachments in, based on
  # access status (as per +public+ attribute). 'public'/'private'
  Paperclip.interpolates :access_dir do |attachment, style|
    attachment.instance.public? ? 'public' : 'private'
  end
  
  # Paperclip attachment
  has_attached_file :file,
    :path => ':env_file_root/:access_dir/:class/:id/:contribution_id.:id.:style.:extension',
    :url => "/:class/:id/:contribution_id.:id.:style.:extension",
    :styles => { :thumb => "100x100>", :preview => "160x120>", :medium => "400x400>", :large => "600x600>" }

  # TODO: Does this need to cope with new file uploaded at same time?
  before_save :relocate_files, :if => Proc.new { |a| a.public_changed? }, :unless => Proc.new { |a| a.new_record? }

  before_save :set_public, :if => Proc.new { |a| a.new_record? }
  
  after_save :delete_old_file_dir, :unless => Proc.new { |a| a.old_file_dir.blank? }
  
  # Paperclip's built-in post-processing for thumbnails should only
  # be run for images.
  before_post_process :image?

  validates_associated :metadata
  validates_presence_of :contribution_id

  validates_attachment_size :file, :less_than => RunCoCo.configuration.max_upload_size, :message => I18n.t('activerecord.errors.models.attachment.attributes.file.size')

  # Europeana 1914-1918 metadata specific validations
  validate :validate_max_one_cover_image_per_contribution

  # Old file directory queued for deletion after public/private change  
  attr_reader :old_file_dir #:nodoc:

  # Returns true if the attached file is an image.
  def image?
    !(file.content_type =~ /^image.*/).nil?
  end
  
  def set_public
    return unless self.contribution_id.present?
    self.public = self.contribution.published?
    true
  end
  
  # Cached array of content types, derived from +RunCoCo.configuration.allowed_upload_extensions+.
  @@paperclip_content_types = nil
  
  # Returns an array of the content types to be accepted by Paperclip,
  # based on the permitted file name extensions configured through
  # +RunCoCo.configuration.allowed_upload_extensions+.
  #
  # Uses mime-types module to determine content types from file name
  # extensions. For IE compatibility, adds "image/pjpeg" for .jpg &
  # .jpeg files, and "image/x-png" for .png files.
  #
  # This array will be cached and re-used in subsequent calls unless
  # reload parameter is +true+.
  def self.paperclip_content_types(reload = false)
    if reload || @@paperclip_content_types.nil?
      if RunCoCo.configuration.allowed_upload_extensions.blank?
        @@paperclip_content_types = []
      else
        @@paperclip_content_types = RunCoCo.configuration.allowed_upload_extensions.split(',').collect { |ext|
          ext.downcase!
          mime_types = MIME::Types.type_for(ext).collect { |mime_type| mime_type.content_type }
          mime_types << 'image/pjpeg' if (ext == 'jpg' || ext == 'jpeg')
          mime_types << 'image/x-png' if (ext == 'png')
          mime_types
        }.flatten.reject { |content_type| content_type.blank? }
      end
    end
    @@paperclip_content_types
  end
  
  validates_attachment_content_type :file, :content_type => Attachment.paperclip_content_types, :unless => Proc.new { Attachment.paperclip_content_types.blank? }, :message => I18n.t('activerecord.errors.models.attachment.attributes.file.content_type')
  
  alias :"rails_metadata_attributes=" :"metadata_attributes="
  def metadata_attributes=(*args)
    self.send(:"rails_metadata_attributes=", *args)
    self.metadata.for_attachment = true
  end
  
  alias :rails_build_metadata :build_metadata
  def build_metadata(*args)
    rails_build_metadata(*args)
    self.metadata.for_attachment = true
  end
  
  def to_hash
    hash = { :title => title }
    MetadataField.where(:attachment => true).each do |field|
      hash[field.name] = metadata.fields[field.name]
    end
    hash
  end
  
  def to_json(options = nil)
    ActiveSupport::JSON.encode(to_hash, options)
  end
  
  protected
  # Moves files between public/private paths when public attr changed
  def relocate_files #:nodoc:
    new_public = self.public
    self.public = self.public_was
    [:original, *self.file.styles.keys].each do |style|
      if self.file.exists?(style)
        self.file.queued_for_write[style] = File.new(self.file.path(style))
      end
    end
    if self.file.options[:storage] == :filesystem
      # Mark old directory for deletion after save
      @old_file_dir = File.dirname(self.file.path)
    end
    self.public = new_public
    true
  end
  
  # Deletes old file directory
  def delete_old_file_dir #:nodoc:
    return unless @old_file_dir.present?
    if self.file.options[:storage] == :filesystem
      begin
        FileUtils.rmdir(@old_file_dir)
      rescue Errno::ENOTEMPTY
      end
    end
    @old_file_dir = nil
  end

  def validate_max_one_cover_image_per_contribution
    if contribution.present? && metadata.field_cover_image_terms.present? && metadata.field_cover_image_terms.first.term == 'yes'
      others = contribution.attachments
      others.reject! { |a| a.id == self.id } unless new_record?
      others.reject! { |a| a.metadata.field_cover_image_terms.blank? || (a.metadata.field_cover_image_terms.first.term != 'yes') }
      unless others.blank?
        self.errors.add('field_cover_image_terms', I18n.t('activerecord.errors.models.metadata_record.one_cover_image')) 
        metadata.errors.add('field_cover_image_terms', I18n.t('activerecord.errors.models.metadata_record.one_cover_image'))
      end
    end
  end  
end

