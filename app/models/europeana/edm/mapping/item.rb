module Europeana
  module EDM
    module Mapping
      ##
      # Maps an +Attachment+ to EDM
      #
      class Item < Base
      
        has_rdf_graph_methods :provided_cho, :web_resource, :ore_aggregation
        
        ##
        # The edm:ProvidedCHO URI of this attachment
        #
        # @return [RDF::URI] URI
        #
        def provided_cho_uri
          @provided_cho_uri ||= RDF::URI.parse(RunCoCo.configuration.site_url + "/contributions/" + @source.contribution_id.to_s + "/attachments/" + @source.id.to_s)
        end
        
        ##
        # The edm:WebResource URI of this attachment
        #
        # @return [RDF::URI] URI
        #
        def web_resource_uri
          url = @source.file.url(:original, :timestamp => false)
          if @source.file.options[:storage] == :filesystem
            url = RunCoCo.configuration.site_url + url
          end
          @web_resource_uri ||= RDF::URI.parse(url)
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
          previous_in_sequence = (item_index == 0 ? nil : @source.contribution.attachments.find(@source.contribution.attachment_ids[item_index - 1]))
          uri = provided_cho_uri
          
          graph << [ uri, RDF.type, RDF::EDM.ProvidedCHO ]
          graph << [ uri, RDF::DCElement.identifier, @source.id.to_s ]
          if @source.title.present?
            graph << [ uri, RDF::DCElement.title, @source.title ]
          else
            item_pos = item_index + 1
            rdf_title = @source.contribution.title + ', item ' + item_pos.to_s
            graph << [ uri, RDF::DCElement.title, rdf_title ]
          end
          
          graph << [ uri, RDF::DCElement.date, meta["date"] ] unless meta["date"].blank?
          graph << [ uri, RDF::DCElement.description, meta["description"] ] unless meta["description"].blank?
          graph << [ uri, RDF::DCElement.description, meta["summary"] ] unless meta["summary"].blank?
          graph << [ uri, RDF::DCElement.description, meta["object_side"].first ] unless meta["object_side"].blank?
          graph << [ uri, RDF::DCElement.format, meta["format"].first ] unless meta["format"].blank?
          graph << [ uri, RDF::DCElement.language, meta["lang_other"] ] unless meta["lang_other"].blank?
          graph << [ uri, RDF::DCElement.source, meta["source"].first ] unless meta["source"].blank?
          graph << [ uri, RDF::DCElement.subject, meta["subject"] ] unless meta["subject"].blank?
          graph << [ uri, RDF::DC.alternative, meta["alternative"] ] unless meta["alternative"].blank?
          graph << [ uri, RDF::DCElement.subject, meta["subject"] ] unless meta["subject"].blank?
          graph << [ uri, RDF::DC.created, meta["date"] ] unless meta["date"].blank?
          graph << [ uri, RDF::DC.extent, meta["page_total"] ] unless meta["page_total"].blank?
          graph << [ uri, RDF::DC.extent, meta["page_number"] ] unless meta["page_number"].blank?
          graph << [ uri, RDF::DC.isPartOf, @source.contribution.edm.provided_cho_uri ]
          graph << [ uri, RDF::DC.medium, meta["format"].first ] unless meta["format"].blank?
          graph << [ uri, RDF::DC.provenance, meta["collection_day"].first ] unless meta["collection_day"].blank?
          graph << [ uri, RDF::DC.tableOfContents, meta["attachment_description"] ] unless meta["attachment_description"].blank?
          graph << [ uri, RDF::EDM.isNextInSequence, previous_in_sequence.edm.provided_cho_uri ] unless previous_in_sequence.blank?
          graph << [ uri, RDF::EDM.type, meta["file_type"].first ] unless meta["file_type"].blank?
          
          unless meta["lang"].blank?
            meta["lang"].each do |lang|
              graph << [ uri, RDF::DCElement.language, lang ]
            end
          end
          
          character1_full_name = Contact.full_name(meta["character1_given_name"], meta["character1_family_name"])
          if character1_full_name.present?
            graph << [ uri, RDF::EDM.hasMet, character1_full_name ]
          else
            graph << [ uri, RDF::EDM.hasMet, meta["date"] ] unless meta["date"].blank?
          end
          
          creator_full_name = Contact.full_name(meta["creator_given_name"], meta["creator_family_name"]) || meta["creator"]
          unless creator_full_name.blank?
            EDM::Resource::Agent.new(RDF::SKOS.prefLabel => creator_full_name).append_to(graph, uri, RDF::DCElement.creator)
          end
          
          [ "keywords", "theatres", "forces", "extended_subjects" ].each do |subject_field|
            unless meta[subject_field].blank?
              meta[subject_field].each do |subject|
                EDM::Resource::Concept.new(RDF::SKOS.prefLabel => subject).append_to(graph, uri, RDF::DCElement.subject)
              end
            end
          end
          
          unless meta["content"].blank?
            EDM::Resource::Concept.new(RDF::SKOS.prefLabel => meta["content"].first).append_to(graph, uri, RDF::DCElement.type)
          end
          
          lat, lng = (meta["location_map"].present? ? meta["location_map"].split(',') : [ nil, nil ])
          unless lat.blank? && lng.blank? && meta['location_placename'].blank?
            EDM::Resource::Place.new({
              RDF::GEO.lat => lat.to_f,
              RDF::GEO.long => lng.to_f,
              RDF::SKOS.prefLabel => meta['location_placename']
            }).append_to(graph, uri, RDF::DC.spatial)
          end
          
          unless meta['date_from'].blank? && meta['date_to'].blank? && meta['date'].blank?
            EDM::Resource::TimeSpan.new({
              RDF::EDM.begin => meta['date_from'],
              RDF::EDM.end => meta['date_to'] || meta['date_from'],
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
          item_index = @source.contribution.attachment_ids.find_index(@source.id)
          previous_in_sequence = (item_index == 0 ? nil : @source.contribution.attachments.find(@source.contribution.attachment_ids[item_index - 1]))
          uri = web_resource_uri
          
          graph << [ uri, RDF.type, RDF::EDM.WebResource ]
          graph << [ uri, RDF::DCElement.description, @source.created_at.to_s ]
          graph << [ uri, RDF::DCElement.format, meta["file_type"].first ] unless meta["file_type"].blank?
          graph << [ uri, RDF::DC.created, @source.created_at.to_s ]
          graph << [ uri, RDF::EDM.rights, RDF::URI.parse(meta["license"].first) ] unless meta["license"].blank?
          graph << [ uri, RDF::EDM.isNextInSequence, previous_in_sequence.edm.provided_cho_uri ] unless previous_in_sequence.blank?
          
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
          graph << [ uri, RDF::EDM.ugc, "TRUE" ]
          graph << [ uri, RDF::EDM.provider, "Europeana 1914-1918" ]
          graph << [ uri, RDF::EDM.dataProvider, "Europeana 1914-1918" ]
          
          graph
        end
        
      end
    end
  end
end
