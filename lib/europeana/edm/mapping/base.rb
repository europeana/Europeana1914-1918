module Europeana
  module EDM
    module Mapping
      class Base
        
        class << self
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
        
        def initialize(source)
          @source = source
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
        
        ##
        # Converts the EDM metadata to RDF/XML
        #
        # @param [Hash] options Options passed on to {RDF::RDFXML::Writer.buffer}
        # @return [String] XML
        #
        def to_rdfxml(options = {})
          namespace_prefixes = {
            :dc => "http://purl.org/dc/elements/1.1/",
            :dcterms => "http://purl.org/dc/terms/",
            :edm => "http://www.europeana.eu/schemas/edm/",
            :ore => "http://www.openarchives.org/ore/terms/",
            :skos => "http://www.w3.org/2004/02/skos/core#",
            :geo => "http://www.w3.org/2003/01/geo/wgs84_pos#"
          }
          
          RDF::RDFXML::Writer.buffer(options.reverse_merge(:prefixes => namespace_prefixes, :max_depth => 4)) do |writer|
            writer << to_rdf_graph
          end
        end
        
        ##
        # Gets the label to display for an RDF statement in EDM record display
        #
        # @param [RDF::Graph] graph The RDF graph from which the statement came
        # @param [RDF::Statement] statement The RDF statement object
        # @return [String] The label for this statement
        #
        def statement_label(graph, statement)
          label = ""
          
          if statement.object.is_a?(RDF::URI)
            if statement.object.to_s.match(/europeana19141918:timespan/)
              graph.query([ statement.object, RDF::URI.parse("http://www.europeana.eu/schemas/edm/begin"), nil ]) do |solution|
                label = solution.object.to_s
              end
              graph.query([ statement.object, RDF::URI.parse("http://www.europeana.eu/schemas/edm/end"), nil ]) do |solution|
                label = (label.present? ? (label + " - ") : "") + solution.object.to_s
              end
            elsif statement.object.to_s.match(RDF::DCMIType.to_uri)
              label = statement.object.qname.last.to_s
            else
              graph.query([ statement.object, RDF::SKOS.prefLabel, nil ]) do |solution|
                label = solution.object.to_s
              end
            end
            label = statement.object.to_s unless label.present?
          elsif statement.object.is_a?(RDF::Literal)
            label = statement.object.to_s
          else
            label = statement.object.to_s + " (#{statement.object.class.name})" # Debugging
          end
          
          label
        end
      end
    end
  end
end
