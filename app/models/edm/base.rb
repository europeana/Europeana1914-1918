module EDM
  ##
  # Shared methods for inclusion in other EDM modules.
  #
  module Base
    class << self
      def included(base)
        base.extend ClassMethods
      end
    end
    
    module ClassMethods
      # Methods to call for RDF graph generation
      attr_reader :rdf_graph_methods
      
      ##
      # Sets the methods to call to construct an RDF graph for an object.
      #
      # The return value of each will be combined into a single +RDF::Graph+.
      #
      # @param [Symbol] *methods Names of the methods to call
      #
      def has_rdf_graph_methods(*methods)
        @rdf_graph_methods = methods
      end
    end
    
    ##
    # Constructs an RDF graph to represent the object.
    #
    # @return [RDF::Graph]
    #
    def to_rdf_graph
      graph = RDF::Graph.new
      
      self.class.rdf_graph_methods.each do |graph_method|
        self.send(graph_method).each do |statement|
          graph << statement
        end
      end
      
      graph
    end
    
    ##
    # Renders the object as RDF N-Triples
    #
    # @return [String]
    #
    def to_ntriples
      to_rdf_graph.dump(:ntriples)
    end
    
  end
end
