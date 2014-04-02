module Europeana
  module EDM
    ##
    # EDM resource
    #
    module Resource
      class Base < RDF::Graph
        # [RDF::URI] Resource identifier
        attr_reader :id
        
        ##
        # @param [Hash] properties EDM properties to set on this resource. Keys
        #   are RDF predicates, values are objects (the new object is the 
        #   subject).
        #
        def initialize(properties = {}, *args, &block)
          super(*args, &block)
          
          @id = make_id(properties)
          
          self << [ @id, RDF.type, RDF::EDM.send(resource_type.to_sym) ]
          
          properties.each_pair do |predicate, object|
            self << [ @id, predicate, object ] unless object.blank?
          end
          
          self
        end
        
        ##
        # Appends this resource's RDF statements to another RDF graph
        #
        # @param [RDF::Graph] graph Graph to append this resource's statements to
        # @param subject Link this resource to the given subject in the RDF graph
        # @param predicate Use this predicate to link this resource to the subject
        #   subject specified in +subject+
        # @return [RDF::Graph]
        #
        def append_to(graph, subject = nil, predicate = nil)
          self.each do |statement|
            graph << statement
          end
          
          if subject.present? && predicate.present?
            graph << [ subject, predicate, id ]
          end
          
          graph
        end
        
      protected
        
        def make_id(properties = {})
          RDF::URI.parse("europeana19141918:" + resource_type.downcase + "/" + Digest::MD5.hexdigest(Hash[properties.sort].to_yaml))
        end
        
        def resource_type
          self.class.to_s.demodulize
        end
      end
      
      class Agent < Base; end
      class Concept < Base; end
      class Event < Base; end
      class PhysicalThing < Base; end
      class Place < Base; end
      class TimeSpan < Base; end

    end
  end
end
