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
  
  def geometry=(geometry)
    geometry_f = {}
    geometry.each_pair do |key, value|
      geometry_f[key] = value.to_f
    end
    super(geometry_f)
  end
  
end
