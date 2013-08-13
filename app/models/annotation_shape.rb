##
# Stores shape(s) for Annotorious image annotations
#
class AnnotationShape < ActiveRecord::Base
  belongs_to :annotation
  
  validates_presence_of :annotation_id, :type, :units, :geometry
  
  validates_inclusion_of :type, :in => [ "rect" ]
  validates_inclusion_of :units, :in => [ "pixels", "relative" ]
  
  attr_protected :annotation_id
end
