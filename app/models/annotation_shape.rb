##
# Stores shape(s) for Annotorious image annotations
#
class AnnotationShape < ActiveRecord::Base
  belongs_to :annotation
  
  validates_presence_of :annotation_id, :shape_type, :units, :geometry
  
  validates_inclusion_of :shape_type, :in => [ "rect" ]
  validates_inclusion_of :units, :in => [ "pixels", "relative" ]
  
  attr_protected :annotation_id
  
  serialize :geometry
  
  def to_hash
    {
      :type => shape_type,
      :units => units,
      :geometry => geometry
    }
  end
  
end
