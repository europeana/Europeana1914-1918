module Europeana
  module EDM
    module Mapping
      ##
      # Maps an +Attachment+ to EDM
      #
      module Item
      
        def self.included(base)
          base.class_eval do
            include EDM::Mapping
            has_rdf_graph_methods :edm_provided_cho, :edm_web_resource, :ore_aggregation
          end
        end
        
        ##
        # Constructs the edm:ProvidedCHO for this item
        #
        # @return [RDF::Graph] RDF graph of the edm:ProvidedCHO
        #
        def edm_provided_cho
          graph = RDF::Graph.new
          meta = metadata.fields
          item_index = contribution.attachment_ids.find_index(id)
          next_in_sequence = contribution.attachments[item_index + 1]
          uri = edm_provided_cho_uri
          
          graph << [ uri, RDF.type, RDF::EDM.ProvidedCHO ]
          graph << [ uri, RDF::DC.identifier, id.to_s ]
          if title.present?
            graph << [ uri, RDF::DC.title, title ]
          else
            item_pos = item_index + 1
            rdf_title = contribution.title + ', item ' + item_pos.to_s
            graph << [ uri, RDF::DC.title, rdf_title ]
          end
          
          graph << [ uri, RDF::DC.date, meta["date"] ] unless meta["date"].blank?
          graph << [ uri, RDF::DC.description, meta["description"] ] unless meta["description"].blank?
          graph << [ uri, RDF::DC.description, meta["summary"] ] unless meta["summary"].blank?
          graph << [ uri, RDF::DC.description, meta["object_side"].first ] unless meta["object_side"].blank?
          graph << [ uri, RDF::DC.format, meta["format"].first ] unless meta["format"].blank?
          graph << [ uri, RDF::DC.language, meta["lang_other"] ] unless meta["lang_other"].blank?
          graph << [ uri, RDF::DC.source, meta["source"].first ] unless meta["source"].blank?
          graph << [ uri, RDF::DC.subject, meta["subject"] ] unless meta["subject"].blank?
          graph << [ uri, RDF::DC.alternative, meta["alternative"] ] unless meta["alternative"].blank?
          graph << [ uri, RDF::DC.subject, meta["subject"] ] unless meta["subject"].blank?
          graph << [ uri, RDF::DC.created, meta["date"] ] unless meta["date"].blank?
          graph << [ uri, RDF::DC.extent, meta["page_total"] ] unless meta["page_total"].blank?
          graph << [ uri, RDF::DC.extent, meta["page_number"] ] unless meta["page_number"].blank?
          graph << [ uri, RDF::DC.isPartOf, contribution.edm_provided_cho_uri ]
          graph << [ uri, RDF::DC.medium, meta["format"].first ] unless meta["format"].blank?
          graph << [ uri, RDF::DC.provenance, meta["collection_day"].first ] unless meta["collection_day"].blank?
          graph << [ uri, RDF::EDM.isNextInSequence, next_in_sequence.edm_provided_cho_uri ] unless next_in_sequence.blank?
          graph << [ uri, RDF::EDM.realizes, meta["file_type"].first ] unless meta["file_type"].blank?
          graph << [ uri, RDF::EDM.type, meta["file_type"].first ] unless meta["file_type"].blank?
          
          unless meta["lang"].blank?
            meta["lang"].each do |lang|
              graph << [ uri, RDF::DC.language, lang ]
            end
          end
          
          if character1_full_name = Contact.full_name(meta["character1_given_name"], meta["character1_family_name"])
            graph << [ uri, RDF::EDM.hasMet, character1_full_name ]
          else
            graph << [ uri, RDF::EDM.hasMet, meta["date"] ] unless meta["date"].blank?
          end
          
          creator_full_name = Contact.full_name(meta["creator_given_name"], meta["creator_family_name"]) || meta["creator"]
          unless creator_full_name.blank?
            EDM::Resource::Agent.new(RDF::SKOS.prefLabel => creator_full_name).append_to(graph, uri, RDF::DC.creator)
          end
          
          [ "keywords", "theatres", "forces" ].each do |subject_field|
            unless meta[subject_field].blank?
              meta[subject_field].each do |subject|
                EDM::Resource::Concept.new(RDF::SKOS.prefLabel => subject).append_to(graph, uri, RDF::DC.subject)
              end
            end
          end
          
          unless meta["content"].blank?
            EDM::Resource::Concept.new(RDF::SKOS.prefLabel => meta["content"].first).append_to(graph, uri, RDF::DC.type)
          end
          
          lat, lng = meta["location_map"].split(',')
          unless lat.blank? && lng.blank? && meta['location_placename'].blank?
            EDM::Resource::Place.new({
              RDF::GEO.lat => lat.to_f,
              RDF::GEO.lng => lng.to_f,
              RDF::SKOS.prefLabel => meta['location_placename']
            }).append_to(graph, uri, RDF::DC.spatial)
          end
          
          unless meta['date_from'].blank? && meta['date_to'].blank? && meta['date'].blank?
            EDM::Resource::TimeSpan.new({
              RDF::EDM.begin => meta['date_from'],
              RDF::EDM.end => meta['date_to'],
              RDF::SKOS.prefLabel => meta['date']
            }).append_to(graph, uri, RDF::DC.temporal)
          end
          
          graph
        end
        
        ##
        # Constructs the edm:WebResource for this item
        #
        # @return [RDF::Graph] RDF graph of the edm:WebResource
        #
        def edm_web_resource
          graph = RDF::Graph.new
          meta = metadata.fields
          item_index = contribution.attachment_ids.find_index(id)
          next_in_sequence = contribution.attachments[item_index + 1]
          uri = edm_web_resource_uri
          
          graph << [ uri, RDF.type, RDF::EDM.WebResource ]
          graph << [ uri, RDF::DC.description, created_at.to_s ]
          graph << [ uri, RDF::DC.format, meta["file_type"].first ] unless meta["file_type"].blank?
          graph << [ uri, RDF::DC.created, created_at.to_s ]
          graph << [ uri, RDF::EDM.rights, RDF::URI.parse(meta["license"].first) ] unless meta["license"].blank?
          graph << [ uri, RDF::EDM.isNextInSequence, next_in_sequence.edm_web_resource_uri ] unless next_in_sequence.blank?
          
          graph
        end
        
        ##
        # Constructs the ore:Aggregation for this item
        #
        # @return [RDF::Graph] RDF graph of the ore:Aggregation
        #
        def ore_aggregation
          graph = RDF::Graph.new
          meta = metadata.fields
          uri = ore_aggregation_uri
          
          graph << [ uri, RDF.type, RDF::ORE.Aggregation ]
          graph << [ uri, RDF::EDM.aggregatedCHO, edm_provided_cho_uri ]
          graph << [ uri, RDF::EDM.isShownAt, contribution.edm_web_resource_uri ]
          graph << [ uri, RDF::EDM.isShownBy, edm_web_resource_uri ]
          graph << [ uri, RDF::EDM.object, edm_web_resource_uri ]
          graph << [ uri, RDF::EDM.rights, RDF::URI.parse(meta["license"].first) ] unless meta["license"].blank?
          
          graph
        end
        
        ##
        # The edm:ProvidedCHO URI of this attachment
        #
        # @return [RDF::URI] URI
        #
        def edm_provided_cho_uri
          @edm_provided_cho_uri ||= RDF::URI.parse(RunCoCo.configuration.site_url + file.url(:original, :timestamp => false))
        end
        
        ##
        # The edm:WebResource URI of this attachment
        #
        # @return [RDF::URI] URI
        #
        def edm_web_resource_uri
          @edm_web_resource_uri ||= RDF::URI.parse(RunCoCo.configuration.site_url + file.url(:full, :timestamp => false))
        end
        
        ##
        # The ore:Aggregation URI of this attachment
        #
        # @return [RDF::URI] URI
        #
        def ore_aggregation_uri
          @ore_aggregation_uri ||= RDF::URI.parse("europeana19141918:aggregation/attachment/" + id.to_s)
        end
        
      end
    end
  end
end
