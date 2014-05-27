##
# Stores Annotorious image annotations
#
class Annotation < ActiveRecord::Base
  belongs_to :user
  belongs_to :annotatable, :polymorphic => true
  has_many :shapes, :class_name => "AnnotationShape", :dependent => :destroy
  
  has_record_statuses :published, :flagged, :depublished, :revised
  acts_as_taggable_on :flags
  
  validates :user, :annotatable, :text, :src, :presence => true
  validates :src, :length => { :maximum => 2048 }
  validates :src, :uri => true
  validates_associated :shapes
  
  accepts_nested_attributes_for :shapes
  attr_protected :user_id
  
  def to_hash
    {
      :id => id,
      :text => text,
      :shapes => shapes.collect(&:to_hash)
    }
  end
  
  def to_rdf_graph
    graph = RDF::Graph.new
    uri = rdf_uri
    source_uri = RDF::URI.parse(src)
    
    graph << [ rdf_uri, RDF.type, RDF::OA.Annotation ]
    graph << [ rdf_uri, RDF::OA.hasBody, text ]
    
    shapes.each do |shape|
      if target_uri = shape.rdf_uri
        graph << [ rdf_uri, RDF::OA.hasTarget, target_uri ]
        graph << [ target_uri, RDF.type, RDF::DC.Image ]
      end
    end
    
    graph
  end
  
  def to_ntriples
    to_rdf_graph.dump(:ntriples)
  end
  
  def rdf_uri
    @rdf_uri ||= RDF::URI.parse("europeana19141918:annotation/" + id.to_s)
  end
  
  ##
  # Checks if a user has flagged this annotation
  #
  # @param [User] user The user to check
  # @return [Boolean]
  #
  def flagged_by?(user)
    flaggings = self.flags.collect(&:taggings).flatten.uniq
    flaggings.collect(&:tagger_id).include?(user.id)
  end
end
