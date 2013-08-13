##
# Stores Annotorious image annotations
#
class Annotation < ActiveRecord::Base
  belongs_to :user
  belongs_to :attachment
  has_many :shapes, :class_name => "AnnotationShape", :dependent => :destroy
  
  validates_presence_of :user, :attachment, :text
  validates_associated :shapes
  
  accepts_nested_attributes_for :shapes
  attr_protected :user_id
end
