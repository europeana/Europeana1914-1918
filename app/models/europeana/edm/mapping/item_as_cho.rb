module Europeana
  module EDM
    module Mapping
      ##
      # Maps an +Attachment+ to EDM CHO
      #
      # For items with rich metadata distinct from parent story's.
      class ItemAsCHO < Item
      
        has_rdf_graph_methods :provided_cho, :web_resource, :ore_aggregation, :parent_story_web_resource
        
        ##
        # The edm:ProvidedCHO URI of this attachment
        #
        # @return [RDF::URI] URI
        #
        def provided_cho_uri
          @provided_cho_uri ||= RDF::URI.parse(RunCoCo.configuration.site_url + "/contributions/" + @source.contribution_id.to_s + "/attachments/" + @source.id.to_s)
        end
        
        ##
        # The ore:Aggregation URI of this attachment
        #
        # @return [RDF::URI] URI
        #
        def ore_aggregation_uri
          @ore_aggregation_uri ||= RDF::URI.parse("europeana19141918:aggregation/attachment/" + @source.id.to_s)
        end
        
        ##
        # Constructs the edm:ProvidedCHO for this item
        #
        # @return [RDF::Graph] RDF graph of the edm:ProvidedCHO
        #
        def provided_cho
          graph = RDF::Graph.new
          meta = @source.metadata.fields
          item_index = @source.contribution.attachment_ids.find_index(@source.id)
          previous_in_sequence_id = @source.contribution.attachment_ids[item_index - 1]
          previous_in_sequence = (item_index == 0 ? nil : @source.contribution.attachments.detect { |a| a.id == previous_in_sequence_id })
          uri = provided_cho_uri
          
          graph << [ uri, RDF.type, RDF::EDM.ProvidedCHO ]
          graph << [ uri, RDF::DCElement.identifier, @source.id.to_s ]
          graph << [ uri, RDF::DCElement.title, @source.title ]
          graph << [ uri, RDF::DC.created, @source.created_at.to_s ]

          graph << [ uri, RDF::DCElement.date, meta["date"] ] unless meta["date"].blank?
          graph << [ uri, RDF::DCElement.description, meta["attachment_description"] ] unless meta["attachment_description"].blank?
          graph << [ uri, RDF::DCElement.description, meta["summary"] ] unless meta["summary"].blank?
          graph << [ uri, RDF::DCElement.description, meta["object_side"].first ] unless meta["object_side"].blank?
          graph << [ uri, RDF::DCElement.format, meta["format"].first ] unless meta["format"].blank?
          graph << [ uri, RDF::DCElement.source, "UGC" ]
          graph << [ uri, RDF::DCElement.source, meta["source"].first ] unless meta["source"].blank?
          graph << [ uri, RDF::DCElement.subject, RDF::Literal.new("World War I", :language => :en) ]
          graph << [ uri, RDF::DC.alternative, RDF::Literal.new(meta["alternative"], :language => :en) ] unless meta["alternative"].blank?
          graph << [ uri, RDF::DCElement.subject, meta["subject"] ] unless meta["subject"].blank?
          graph << [ uri, RDF::DC.extent, meta["page_total"] ] unless meta["page_total"].blank?
          graph << [ uri, RDF::DC.extent, meta["page_number"] ] unless meta["page_number"].blank?
          graph << [ uri, RDF::DC.isPartOf, @source.contribution.edm.provided_cho_uri ]
          graph << [ @source.contribution.edm.provided_cho_uri, RDF::DC.hasPart, uri ]
          graph << [ uri, RDF::DC.medium, meta["format"].first ] unless meta["format"].blank?
          graph << [ uri, RDF::DC.provenance, meta["collection_day"].first ] unless meta["collection_day"].blank?
          graph << [ uri, RDF::DC.tableOfContents, meta["attachment_description"] ] unless meta["attachment_description"].blank?
          graph << [ uri, RDF::EDM.isNextInSequence, previous_in_sequence.edm.provided_cho_uri ] unless previous_in_sequence.blank?
          graph << [ uri, RDF::EDM.type, meta["file_type"].first ] unless meta["file_type"].blank?
          
          if [ meta["lang"], meta["lang_other"] ].all?(&:blank?)
            graph << [ uri, RDF::DCElement.language, "und" ]
          else
            graph << [ uri, RDF::DCElement.language, meta["lang_other"] ] unless meta["lang_other"].blank?
            unless meta["lang"].blank?
              meta["lang"].each do |lang|
                graph << [ uri, RDF::DCElement.language, lang ]
              end
            end
          end
          
          [ '1', '2' ].each do |cn|
            character_full_name = Contact.full_name(meta["character#{cn}_given_name"], meta["character#{cn}_family_name"])
            unless [ character_full_name, meta["character#{cn}_dob"], meta["character#{cn}_dod"], meta["character#{cn}_pob"], meta["character#{cn}_pod"] ].all?(&:blank?)
              EDM::Resource::Agent.new({
                RDF::SKOS.prefLabel => character_full_name,
                RDF::RDAGr2.dateOfBirth => meta["character#{cn}_dob"],
                RDF::RDAGr2.dateOfDeath => meta["character#{cn}_dod"],
                RDF::RDAGr2.placeOfBirth => meta["character#{cn}_pob"],
                RDF::RDAGr2.placeOfDeath => meta["character#{cn}_pod"]
              }).append_to(graph, uri, RDF::DCElement.subject)
            end
          end
          
          creator_full_name = Contact.full_name(meta["creator_given_name"], meta["creator_family_name"])
          unless creator_full_name.blank?
            EDM::Resource::Agent.new(RDF::SKOS.prefLabel => creator_full_name).append_to(graph, uri, RDF::DCElement.creator)
          end
          
          unless meta["creator"].blank?
            EDM::Resource::Agent.new(RDF::SKOS.prefLabel => meta["creator"]).append_to(graph, uri, RDF::DCElement.creator)
          end
          
          contributor_full_name = meta["contributor_behalf"].present? ? meta["contributor_behalf"] : @source.contribution.contributor.contact.full_name
          unless contributor_full_name.blank?
            EDM::Resource::Agent.new(RDF::SKOS.prefLabel => contributor_full_name).append_to(graph, uri, RDF::DCElement.contributor)
          end
          
          [
            { :field => "keywords", :predicate => RDF::DCElement.subject, :language => :en },
            { :field => "forces", :predicate => RDF::DCElement.subject, :language => :en },
            { :field => "extended_subjects", :predicate => RDF::DCElement.subject, :language => :fr },
            { :field => "theatres", :predicate => RDF::DC.spatial, :language => :en },
            { :field => "content", :predicate => RDF::DCElement.type, :language => :en }
          ].each do |concept|
            unless meta[concept[:field]].blank?
              meta[concept[:field]].each do |value|
                graph << [ uri, concept[:predicate], RDF::Literal.new(value, :language => concept[:language]) ]
              end
            end
          end
          
          lat, lng = (meta["location_map"].present? ? meta["location_map"].split(',') : [ nil, nil ])
          unless [ lat, lng, meta['location_placename'] ].all?(&:blank?)
            if [ lat, lng ].all?(&:blank?)
              graph << [ uri, RDF::DC.spatial, meta['location_placename'] ]
            else
              EDM::Resource::Place.new({
                RDF::WGS84Pos.lat => (lat.blank? ? nil : lat.to_f),
                RDF::WGS84Pos.long => (lng.blank? ? nil : lng.to_f),
                RDF::SKOS.prefLabel => meta['location_placename']
              }).append_to(graph, uri, RDF::DC.spatial)
            end
          end
          
          unless [ meta['date_from'], meta['date_to'], meta['date'] ].all?(&:blank?)
            EDM::Resource::TimeSpan.new({
              RDF::EDM.begin => meta['date_from'],
              RDF::EDM.end => (meta['date_to'].present? ? meta['date_to'] : meta['date_from']),
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
        def web_resource
          graph = RDF::Graph.new
          meta = @source.metadata.fields
          uri = web_resource_uri
          
          graph << [ uri, RDF.type, RDF::EDM.WebResource ]
          graph << [ uri, RDF::DCElement.format, meta["file_type"].first ] unless meta["file_type"].blank?
          graph << [ uri, RDF::DC.created, @source.created_at.to_s ]
          graph << [ uri, RDF::EDM.rights, RDF::URI.parse(meta["license"].first) ] unless meta["license"].blank?

          graph
        end
        
        ##
        # Constructs the ore:Aggregation for this item
        #
        # @return [RDF::Graph] RDF graph of the ore:Aggregation
        #
        def ore_aggregation
          graph = RDF::Graph.new
          meta = @source.metadata.fields
          uri = ore_aggregation_uri
          
          graph << [ uri, RDF.type, RDF::ORE.Aggregation ]
          graph << [ uri, RDF::EDM.aggregatedCHO, provided_cho_uri ]
          graph << [ uri, RDF::EDM.isShownBy, web_resource_uri ]
          if meta["license"].blank?
            graph << [ uri, RDF::EDM.rights, RDF::URI.parse("http://creativecommons.org/publicdomain/zero/1.0/") ]
          else
            graph << [ uri, RDF::EDM.rights, RDF::URI.parse(meta["license"].first) ] 
          end
          graph << [ uri, RDF::EDM.ugc, "true" ]
          graph << [ uri, RDF::EDM.provider, "Europeana 1914-1918" ]
          graph << [ uri, RDF::EDM.dataProvider, "Europeana 1914-1918" ]
          graph << [ uri, RDF::EDM.hasView, web_resource_uri ]

          graph
        end
        

        def parent_story_web_resource
          graph = RDF::Graph.new
          if @source.cover_image?
            graph << [ @source.contribution.edm.ore_aggregation_uri, RDF::EDM.hasView, web_resource_uri ]
          end
          graph
        end
      end
    end
  end
end
