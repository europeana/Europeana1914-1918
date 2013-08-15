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
    geometry_cast = {}
    
    geometry.each_pair do |key, value|
      geometry_cast[key] = case units
      when "pixels"
        value.to_i
      when "relative"
        value.to_f
      else
        value
      end
    end
    
    super(geometry_cast)
  end
  
  def media_fragment
    unless @media_fragment.present?
      if shape_type == "rect"
        if units == "relative"
          @media_fragment = sprintf("xywh=percent:%f,%f,%f,%f", geometry["x"], geometry["y"], geometry["width"], geometry["height"])
        elsif units == "pixels"
          @media_fragment = sprintf("xywh=pixel:%d,%d,%d,%d", geometry["x"], geometry["y"], geometry["width"], geometry["height"])
        end
      end
    end
    
    @media_fragment
  end
  
  def rdf_uri
    return nil unless media_fragment.present?
    
    @rdf_uri ||= RDF::URI.parse(annotation.src + "#" + media_fragment)
  end
  
end
