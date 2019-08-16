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

  has_many :annotations, :as => :annotatable, :dependent => :destroy
  has_many :mappings, :class_name => 'MetadataMapping', :as => :mappable, :dependent => :destroy

  accepts_nested_attributes_for :metadata

  attr_accessible :title, :file, :metadata_attributes, :dropbox_path

  attr_accessor :post_process

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

  # :s3_acl_url => If the file is public, the S3 URL; if private, the local URL
  # which retrieves the file over the S3 API if the user is permitted to view it.
  Paperclip.interpolates :s3_acl_url do |attachment, style|
    if attachment.instance.public?
      pattern = ":s3_domain_url"
    else
      pattern = "/:class/:id/:contribution_id.:id.:style.:extension"
    end
    Paperclip::Interpolations.interpolate(pattern, attachment, style)
  end

  # Paperclip attachment
  # add sizes via :styles
  #     e.g. :new_size => "500x500>"
  # and make sure to add the routing to routes.rb
  #    :constraints => { :style => /(thumb|preview|medium|large|full|new_size)/ }
  # run the following to create the new_size version or update it if the dimmensions changed
  #     bundle exec rake paperclip:refresh:thumbnails CLASS=Attachment STYLES=new_size_name --trace
  has_attached_file :file,
    :path => (Paperclip::Attachment.default_options[:storage] == :filesystem ? ":env_file_root/:access_dir/" : "") + ":class/:id/:contribution_id.:id.:style.:extension",
    :url => (Paperclip::Attachment.default_options[:storage] == :s3 ? ":s3_acl_url" : "/:class/:id/:contribution_id.:id.:style.:extension"),
    :styles => { :thumb => [ "100x100>", :jpg ], :preview => [ "160x120>", :jpg ], :medium => [ "400x400>", :jpg ], :large => [ "1024x768>", :jpg ] },
    :s3_permissions => Proc.new { |a| a.instance.s3_acl }

  before_save :relocate_files, :if => Proc.new { |a| (a.file.options[:storage] == :filesystem) && a.public_changed? }, :unless => Proc.new { |a| a.new_record? }

  before_save :set_public, :if => Proc.new { |a| a.new_record? }

  after_save :delete_old_file_dir, :if => Proc.new { |a| a.file.options[:storage] == :filesystem }, :unless => Proc.new { |a| a.old_file_dir.blank? }

  # Paperclip's built-in post-processing for thumbnails should only

  # be run on certain file types.
  before_post_process :make_thumbnails?

  before_post_process :post_process?

  validates_associated :metadata
  validates_presence_of :contribution_id

  validates_attachment_size :file, :less_than => RunCoCo.configuration.max_upload_size, :message => I18n.t('activerecord.errors.models.attachment.attributes.file.size')

  # Europeana 1914-1918 metadata specific validations
  validate :validate_max_one_cover_image_per_contribution

  # Old file directory queued for deletion after public/private change
  attr_reader :old_file_dir #:nodoc:

  # Path of Dropbox file to copy.
  # User and session dependent, so handled by controller logic.
  attr_accessor :dropbox_path

  def self.published
    joins(:contribution => :current_status).where([ "current_statuses.name IN (?)", Contribution.published_status ])
  end

  ##
  # Returns true if this attachment should have thumbnails made for it.
  #
  # Images, PDFs and mpeg videos get thumbnails.
  #
  # @return [Boolean]
  #
  def make_thumbnails?
    image? || pdf? || identifyable_video?
  end

  ##
  # Returns true if the attached file is an image.
  #
  # @return [Boolean]
  #
  def image?
    !(file.content_type =~ /^image.*/).nil?
  end

  ##
  # Returns true if the attached file is a video.
  #
  # @return [Boolean]
  #
  def video?
    !(file.content_type =~ /^video\//).nil?
  end

  ##
  # Returns true if the attached file is of a video content type recognised by
  # ImageMagick's identify command.
  #
  # @return [Boolean]
  #
  def identifyable_video?
    [ 'video/mp4', 'video/mpeg', 'video/vnd.objectvideo' ].include?(file.content_type)
  end

  ##
  # Returns true if the attached file is audio.
  #
  # @return [Boolean]
  #
  def audio?
    !(file.content_type =~ /^audio\//).nil?
  end

  ##
  # Returns true if the attached file is a PDF.
  #
  # @return [Boolean]
  #
  def pdf?
    file.content_type == 'application/pdf'
  end

  def has_thumbnail?(size)
    make_thumbnails? && ((file.options[:storage] != :filesystem) || File.exists?(file.path(size)))
  end

  def post_process?
    if @post_process.nil?
      @post_process = true
    end
    @post_process
  end

  def set_public
    return unless self.contribution_id.present?
    self.public = self.contribution.published?

    if file.options[:storage] == :s3
      [:original, *self.file.styles.keys].each do |style|
        if self.file.exists?(style)
          file.s3_object(style).acl = s3_acl
        end
      end
    end

    true
  end

  def s3_acl
    self.contribution.published? ? "public_read" : "private"
  end

  def public?
    self.public == true
  end

  ##
  # Cached array of content types, derived from +RunCoCo.configuration.allowed_upload_extensions+.
  # @see .paperclip_content_types
  #
  @@paperclip_content_types = nil

  ##
  # Returns an array of the content types to be accepted by Paperclip,
  # based on the permitted file name extensions configured through
  # +RunCoCo.configuration.allowed_upload_extensions+.
  #
  # Uses mime-types module to determine content types from file name
  # extensions. For IE compatibility, adds "image/pjpeg" for .jpg &
  # .jpeg files, and "image/x-png" for .png files.
  #
  # @param [Boolean] reload If +true+, force a reload of content types,
  #   otherwise they are cached.
  # @return [Array<String>] Content type strings.
  #
  def self.paperclip_content_types(reload = false)
    if reload || @@paperclip_content_types.nil?
      if RunCoCo.configuration.allowed_upload_extensions.blank?
        @@paperclip_content_types = []
      else
        @@paperclip_content_types = RunCoCo.configuration.allowed_upload_extensions.split(',').collect { |ext|
          ext.downcase!
          MIME::Types.type_for(ext).collect(&:content_type).concat case ext
            when 'jpg', 'jpeg'
              [ 'image/pjpeg' ]
            when 'png'
              [ 'image/x-png' ]
            when 'mp3'
              [ 'audio/x-mpeg', 'audio/mp3', 'audio/x-mp3', 'audio/mpeg3',
                'audio/x-mpeg3', 'audio/mpg', 'audio/x-mpg', 'audio/x-mpegaudio' ]
            when 'ogg'
              [ 'audio/ogg' ]
            when 'mp4'
              [ 'video/mp4' ]
            when 'webm'
              [ 'video/webm' ]
            else
              []
          end
        }.flatten.reject(&:blank?)
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

  def thumbnail_url(size)
    if has_thumbnail?(size)
      file.url(size)
    end
  end

  ##
  # Returns the annotations on this attachment that are visible to all users.
  #
  # Visible annotations are those that currently have the status:
  # published, flagged or revised
  #
  # @return [Array<Annotation>] Visible annotation
  #
  def visible_annotations
    annotations.with_status(:published, :flagged, :revised)
  end

  def index!
    if contribution.respond_to?(:index!)
      contribution.index!
    end
  end

  def edm
    @edm ||= edm_mapping_class.new(self)
  end

  def edm_mapping_class
    contribution.attachment_edm_mapping_class
  end

  # A "distinct" title is one where it:
  # 1. is not blank when stripped
  # 2. is not the same as the contribution's, when both are stripped
  def has_distinct_title?
    stripped_title = (title || "").strip
    stripped_title.present? && stripped_title != (contribution.title || "").strip
  end

  # A "distinct" field is one where it:
  # 1. is not blank when stripped (if a string)
  # 2. is not the same as the contribution's, when both are stripped (if strings)
  def has_distinct_metadata_field?(attachment_field, contribution_field = attachment_field)
    attachment_value = metadata.fields[attachment_field].nil? ? nil : metadata.fields[attachment_field].dup
    attachment_value.strip! if attachment_value.is_a?(String)
    attachment_value.sort! if attachment_value.is_a?(Array)

    contribution_value = contribution.metadata.fields[contribution_field].nil? ? nil : contribution.metadata.fields[contribution_field].dup
    contribution_value.strip! if contribution_value.is_a?(String)
    contribution_value.sort! if contribution_value.is_a?(Array)

    attachment_value.present? && (attachment_value != contribution_value)
  end

  def has_rich_metadata?
    has_distinct_title? && has_distinct_metadata_field?("attachment_description", "description")
  end

  def has_scarce_metadata?
    !has_rich_metadata?
  end

  def cover_image?
    contribution.cover_image == self
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
    if (self.file.options[:storage] == :filesystem) && File.exists?(@old_file_dir)
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
