module EDM
  autoload :Story, 'edm/story'
  autoload :Item,  'edm/item'
  
  ##
  # Renders the object as RDF N-Triples
  #
  # @return [String]
  #
  def to_ntriples
    to_rdf_graph.dump(:ntriples)
  end
end
