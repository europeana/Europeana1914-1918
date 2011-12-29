# Model for a record of metadata.
#
# Metadata records will be associated with either a contribution
# or an attachment, describing that object.
#
# The attributes on a metadata record are customisable. They are
# added, modified and removed by creating, updating and deleting
# MetadataField instances.
class MetadataRecord < ActiveRecord::Base
  attr_writer :validating
  attr_writer :cataloguing
  attr_protected :id, :updated_at, :created_at, :validating, :cataloguing

  has_one :contribution
  has_one :attachment
  has_and_belongs_to_many :taxonomy_terms
  
  COLUMN_TYPES = [ :string, :text, :date, :integer ]
  FIELD_NAME_FORMAT = /\A[a-z0-9_]+\Z/
  
  before_save :protect_cataloguing_fields
  after_save :set_contribution_delta_flag

  validate :validate_numericality_of_taxonomy_fields
  validate :validate_date_fields_as_civil_dates

  class << self
    # Adds column to the db table for custom field
    def add_field(field_name, type, options = {})
      unless field_name.match(FIELD_NAME_FORMAT)
        raise CoCoCo::FieldNameInvalid, "Invalid characters in field name \"#{field_name}\""
      end
      column_name = column_name(field_name)
      if column_names.include?(column_name)
        raise CoCoCo::FieldNameInvalid, "#{table_name} already includes the field \"#{field_name}\""
      end
      unless COLUMN_TYPES.include?(type)
        raise ArgumentError, "#{type.inspect} is not one of the allowed column types: #{COLUMN_TYPES.inspect}"
      end
      connection.add_column(table_name, column_name, type, options)
      reset_column_information
    end

    # Renames column in the db table
    def rename_field(field_name, new_field_name)
      column_name = column_name(field_name)
      new_column_name = column_name(new_field_name)
      unless column_names.include?(column_name)
        raise CoCoCo::FieldNameInvalid, "#{table_name} does not have the field \"#{field_name}\""
      end
      connection.rename_column(table_name, column_name, new_column_name)
      reset_column_information
    end

    # Removes the named column from the db table
    def remove_field(field_name)
      column_name = column_name(field_name)
      unless column_names.include?(column_name)
        raise CoCoCo::FieldNameInvalid, "#{table_name} does not have the field \"#{field_name}\""
      end
      connection.remove_column(table_name, column_name)
      reset_column_information
    end

    # Gets the name to use in the db table for a custom field.
    # Prefixes "field_" on to the passed name.
    #
    # Example:
    #   <tt>MetadataRecord.column_name("author") # => "field_author"</tt>
    def column_name(field_name)
      "field_#{field_name}"
    end

    # Removes all custom metadata field columns from db
    def remove_all_fields
      column_names.each do |column_name|
        if column_name.match(/^field_/)
          connection.remove_column(table_name, column_name)
        end
      end
      reset_column_information
    end

    # Dynamically sets validation callbacks based on MetadataField records.
    #
    # MetadataField records marked required result in a validates_presence_of
    # validation callback on the equivalent MetadataRecord attribute.
    # 
    # MetadataField records of type "geo" result in the MetadataRecord attribute
    # being validated as the format "LAT,LNG", e.g. "51.500,-0.126" for London.
    #
    # MetadataField records of type "date" result in the MetadataRecord attribute
    # being validated as of the format: YYYY, YYYY-MM or YYYY-MM-DD.
    #
    # Returns an array of the resultant validate callbacks.
    def set_validate_callbacks
      @validate_callbacks = []

      # Required fields
      MetadataField.where('required = ?', true).each do |required_field|
        if required_field.field_type == 'taxonomy'
          validates_presence_of "field_#{required_field.name}_terms", :if => :validating?
        else
          validates_presence_of column_name(required_field.name), :if => :validating?
        end
      end

      # Geo fields
      MetadataField.where('field_type = ?', 'geo').each do |geo_field|
        validates_format_of column_name(geo_field.name), :with => /^\s?(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)\s?$/, :allow_blank => true, :allow_nil => true
      end
      
      # Date fields
      MetadataField.where('field_type = ?', 'date').each do |date_field|
        validates_format_of column_name(date_field.name), :with => /^\d{4}(-\d{2}(-\d{2})?)?$/, :allow_blank => true, :allow_nil => true
      end
      
      @validate_callbacks
    end

    # Dynamically sets association based on MetadataField records.
    #
    # MetadataField records of type "taxonomy" result in the MetadataRecord attribute
    # being used as the FK for an association with TaxonomyTerm in a has_many relationship.
    # (through Classification)
    def set_associations
      MetadataField.where('field_type = ?', 'taxonomy').each do |taxonomy_field|
        # Association name derivation duplicates MetadataField#collection_id,
        # which causes app to fail on boot if used here.
        has_and_belongs_to_many :"field_#{taxonomy_field.name}_terms", :class_name => 'TaxonomyTerm', :conditions => { 'taxonomy_terms.metadata_field_id' => taxonomy_field.id }
      end
      nil
    end
    
    # Sets model properties based on custom metadata fields.  
    def adapt_to_metadata_fields
      set_associations  
      set_validate_callbacks
    end
  end

  # Initialise model properties based on custom metadata fields.
  adapt_to_metadata_fields

  # Returns true if record flagged for validation
  def validating?
    @validating == true
  end

  # Returns true if record flagged for cataloguing
  def cataloguing?
    @cataloguing == true
  end
  
  # Returns values of the custom metadata fields in this metadata record.
  # Taxonomy term fields are returned as an array of the terms.
  def fields
    unless defined?(@fields) && @fields
      @fields = {}
      MetadataField.all.each do |mf| 
        @fields[mf.name] = if mf.field_type == 'taxonomy'
          taxonomy_terms = self.send(mf.collection_id)
          if taxonomy_terms.present?
            taxonomy_terms.collect { |t| t.term }
          end        
        else
          self.send(mf.column_name.to_sym)
        end
      end
    end
    @fields
  end

  protected
  # Restores all cataloguing fields to stored values unless cataloguing in process
  def protect_cataloguing_fields #:nodoc:
    unless cataloguing?
      MetadataField.where('cataloguing = ? AND field_type <> ?', true, 'taxonomy').each do |cataloguing_field|
        column_name = self.class.column_name(cataloguing_field.name)
        self.send("#{column_name}=", self.send("#{column_name}_was"))
      end
    end
  end
  
  # Sets delta indexing flag on associated contribution for Sphinx search
  # See http://freelancing-god.github.com/ts/en/deltas.html
  def set_contribution_delta_flag #:nodoc:
    if contribution.present?
      contribution.delta = true
    end
  end
  
  def validate_numericality_of_taxonomy_fields
    MetadataField.where('field_type = ? AND multi = ?', 'taxonomy', false).each do |taxonomy_field|
      if (self.send(taxonomy_field.collection_id).size > 1) || (self.send(taxonomy_field.form_input_name).size > 1)
        self.errors.add(taxonomy_field.collection_id, I18n.t('activerecord.errors.models.metadata_record.taxonomy_field_single')) 
      end
    end
  end
  
  def validate_date_fields_as_civil_dates
    MetadataField.where('field_type = ?', 'date').each do |date_field|
      column_name = self.class.column_name(date_field.name)
      date = self.send(column_name)
      unless date.blank?
        date_parts = date.split('-')
        year = date_parts[0].to_i
        month = (date_parts[1] || 1).to_i
        day = (date_parts[2] || 1).to_i
        self.errors.add(column_name, I18n.t('activerecord.errors.models.metadata_record.date_field_civil')) unless Date.valid_civil?(year, month, day)
      end
    end
  end
end

