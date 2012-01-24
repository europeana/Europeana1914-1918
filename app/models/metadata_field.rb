# MetadataField allows custom fields to be configured for metadata
# collection on contributions and attachments.
# 
# MetadataField attributes:
# * name: A unique name for the field, consisting of lowercase letters
#   [a-z], digits [0-9], and underscore [_]. Required.
# * title: A descriptive title for the field, to be displayed as the label
#   on forms. Optional; a humanized version of the field name will be used
#   if no title is set.
# * field_type: The type of field to create (see below).
# * required: Whether this field is required (true/false).
# * cataloguing: Whether this field should only be shown to cataloguers
#   (true/false). If false, contributors will also be able to edit it.
# * position: Position of the field as an integer, for ordering on forms
#   and displays. Lower values are displayed first.
# * searchable: Whether this field can be searched (true/false).
# * hint: Text displayed on metadata form to assist contributors/
#   cataloguers with field input.
#
# The types of metadata field available are:
# * date: a date, e.g. 2010-04-23
# * geo: a geographical location stored as a string in the format
#   "LAT,LNG", e.g. 67.53,-111.58
# * string: a single line text string
# * taxonomy: a selection from a predefined list of terms
# * text: a multi-line text string
#
# Saving a metadata field adds an equivalent attribute to 
# the MetadataRecord model. Destroying a metadata field removes the
# attribute from the MetadataRecord model.
#
# TODO: Allow custom grouping of fields
class MetadataField < ActiveRecord::Base
  has_many :taxonomy_terms, :order => 'term ASC', :dependent => :destroy do
    # Creates multiple taxonomy terms associated with this metadata field.
    # 
    # <tt>taxonomy_terms_list</tt> is a string containing multiple terms,
    # by default one per line, each of which will result in a taxonomy term 
    # record.
    #
    # Pass a pattern to split by something other than line breaks. For example:
    # <tt>MetadataField.taxonomy_terms.create_from_list("red,blue,green", ",")</tt>
    #
    # Whitespace will be stripped from the start and end of each term, and 
    # duplicates will be silently ignored.
    def create_from_list(taxonomy_terms_list, pattern = /(\r|\n|\r\n)+/)
      taxonomy_terms_list.strip.split(pattern).each do |term|
        term.strip!
        create(:term => term) unless term.blank?
      end
    end
  end
   attr_accessible :name, :title, :field_type, :required, :position, :cataloguing, :taxonomy_terms_attributes, :searchable, :hint, :multi, :show_in_listing, :contribution, :attachment
  accepts_nested_attributes_for :taxonomy_terms
  
  translates :title, :hint # Globalize3

  default_scope order('position')

  FIELD_TYPES = [ 'text', 'string', 'date', 'geo', 'taxonomy' ]

  validates_presence_of :field_type, :name
  validates_inclusion_of :required, :in => [ true, false ]
  validates_inclusion_of :cataloguing, :in => [ true, false ]
  validates_inclusion_of :searchable, :in => [ true, false ]
  validates_inclusion_of :contribution, :in => [ true, false ]
  validates_inclusion_of :attachment, :in => [ true, false ]
  validates_inclusion_of :field_type, :in => FIELD_TYPES, :on => :create
  validates_format_of :name, :with => MetadataRecord::FIELD_NAME_FORMAT, :allow_blank => true
  validates_uniqueness_of :name
  validates_numericality_of :position, :greater_than => 0, :only_integer => true

  validate :validate_cataloguing_optional
  validate :validate_field_type_constancy, :on => :update
  validate :validate_searchable_type
  validate :validate_contribution_or_attachment

  before_save :auto_set_title, :unless => Proc.new { |f| f.title.present? }
  after_save :adapt_other_models
  after_create :add_field_to_metadata_record
  before_save :init_options, :on => :create
  after_update :update_field_in_metadata_record
  after_destroy :remove_field_from_metadata_record
  before_validation :auto_set_position, :on => :create
  
  def column_name
    self.field_type == 'taxonomy' ? nil : MetadataRecord.column_name(self.name)
  end
  
  def column_type_with_options
    @@column_type_with_options ||= { 
      'text' => :text, 
      'string' => :string, 
      'date' => [ :string, { :limit => 10 } ],
      'geo' => :string, 
      'taxonomy' => nil 
    }[ self.field_type ]
  end
  
  def column_type
    @@column_type ||= [ column_type_with_options ].flatten.first
  end
  
  def collection_id
    self.field_type == 'taxonomy' ? :"field_#{self.name}_terms" : nil
  end
  
  def form_input_name
    if self.field_type == 'taxonomy'
      :"#{self.collection_id.to_s.singularize}_ids"
    else
      self.column_name.to_sym
    end
  end      

  class << self
    def destroy_all(conditions = nil)
      super(conditions)
      MetadataRecord.remove_all_fields
    end
  end
  
  def has_options?
    self.field_type == 'taxonomy'
  end
  
  private
  def adapt_other_models
    MetadataRecord.adapt_to_metadata_fields
    Contribution.set_search_index
  end
  
  def add_field_to_metadata_record
    column_type = [ self.column_type_with_options ].flatten
    options = column_type.extract_options!
    column_type = [ column_type ].flatten.first
    MetadataRecord.add_field(self.name, column_type, options) unless self.column_type.nil?
  end

  def update_field_in_metadata_record
    if self.name_changed? && self.column_type.present?
      MetadataRecord.rename_field(self.name_was, self.name)
    end
  end

  def remove_field_from_metadata_record
    MetadataRecord.remove_field(self.name) unless self.column_type.nil?
  rescue RunCoCo::FieldNameInvalid
  end

  def auto_set_title
    self.title = self.name.titleize
  end
  
  def auto_set_position
    self.position = (self.class.maximum(:position) || 0) + 1
  end

  def validate_field_type_constancy
    self.errors.add(:field_type, I18n.t('activerecord.errors.models.metadata_field.attributes.field_type.constancy')) if self.field_type_changed?
  end

  def validate_cataloguing_optional
    self.errors.add(:cataloguing, I18n.t('activerecord.errors.models.metadata_field.attributes.cataloguing.optional')) if (self.cataloguing? && self.required?)
  end
  
  def validate_searchable_type
    self.errors.add(:searchable, I18n.t('activerecord.errors.models.metadata_field.attributes.searchable.field_type')) if (self.searchable? && self.field_type == 'taxonomy')
  end
  
  def validate_contribution_or_attachment
    self.errors.add(:contribution, I18n.t('activerecord.errors.models.metadata_field.attributes.contribution.or_attachment')) unless (self.contribution? || self.attachment?)
  end
  
  # Initializes options for the metadata field based on its field type.
  # Does not overwrite options if already set.
  def init_options
    if field_type == 'taxonomy'
      self.multi = false if self.multi.nil?
    end
    true
  end
end

