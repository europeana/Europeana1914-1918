##
# Module containing methods for conversion of application models to EDM.
#
module EDM
  autoload :Item,  'edm/item'
  autoload :Story, 'edm/story'
  
  ##
  # Renders the object as RDF N-Triples
  #
  # @return [String]
  #
  def to_ntriples
    to_rdf_graph.dump(:ntriples)
  end
end
