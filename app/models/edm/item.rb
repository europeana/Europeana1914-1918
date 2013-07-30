module EDM
  ##
  # Contains methods for conversion of an +Attachment+ to EDM
  #
  module Item
    def self.included(base)
      base.class_eval do
        include EDM
      end
    end
    
    ##
    # Constructs an RDF graph to represent the attachment and its metadata
    # as an ore:Aggregation of edm:ProvidedCHO and edm:WebResource.
    #
    # @return [RDF::Graph]
    #
    def to_rdf_graph
      graph = RDF::Graph.new
      meta = metadata.fields
      item_index = contribution.attachment_ids.find_index(id)
      next_in_sequence = contribution.attachments[item_index + 1]
      
      # edm:ProvidedCHO
      puri = RDF::URI.parse(edm_provided_cho_uri)
      
      graph << [ puri, RDF.type, RDF::EDM.ProvidedCHO ]
      graph << [ puri, RDF::DC.identifier, id.to_s ]
      if title.present?
        graph << [ puri, RDF::DC.title, title ]
      else
        item_pos = item_index + 1
        rdf_title = contribution.title + ', item ' + item_pos.to_s
        graph << [ puri, RDF::DC.title, rdf_title ]
      end
      
      creator_full_name = Contact.full_name(meta["creator_given_name"], meta["creator_family_name"]) || meta["creator"]
      agent_properties = {}
      agent_properties['skos:prefLabel'] = creator_full_name unless creator_full_name.blank?
      unless agent_properties.blank?
        creator_agent_uri = RDF::URI.parse("agent/" + Digest::MD5.hexdigest(agent_properties.to_yaml))
        graph << [ creator_agent_uri, RDF.type, RDF::EDM.Agent ]
        graph << [ creator_agent_uri, RDF::SKOS.prefLabel, agent_properties['skos:prefLabel'] ] unless agent_properties['skos:prefLabel'].blank?
        graph << [ puri, RDF::DC.creator, creator_agent_uri ]
      end
      
      graph << [ puri, RDF::DC.date, meta["date"] ] unless meta["date"].blank?
      graph << [ puri, RDF::DC.description, meta["description"] ] unless meta["description"].blank?
      graph << [ puri, RDF::DC.description, meta["summary"] ] unless meta["summary"].blank?
      graph << [ puri, RDF::DC.description, meta["object_side"].first ] unless meta["object_side"].blank?
      graph << [ puri, RDF::DC.format, meta["format"].first ] unless meta["format"].blank?
      unless meta["lang"].blank?
        meta["lang"].each do |lang|
          graph << [ puri, RDF::DC.language, lang ]
        end
      end
      graph << [ puri, RDF::DC.language, meta["lang_other"] ] unless meta["lang_other"].blank?
      graph << [ puri, RDF::DC.source, meta["source"].first ] unless meta["source"].blank?
      
      [ "keywords", "theatres", "forces" ].each do |subject_field|
        unless meta[subject_field].blank?
          meta[subject_field].each do |subject|
            concept_properties = {}
            concept_properties['skos:prefLabel'] = subject unless subject.blank?
            unless concept_properties.blank?
              subject_concept_uri = RDF::URI.parse("europeana19141918:concept/#{subject_field}/" + Digest::MD5.hexdigest(concept_properties.to_yaml))
              graph << [ subject_concept_uri, RDF.type, RDF::EDM.Concept ]
              graph << [ subject_concept_uri, RDF::SKOS.prefLabel, concept_properties['skos:prefLabel'] ]
              graph << [ puri, RDF::DC.subject, subject_concept_uri ]
            end
          end
        end
      end
      
      concept_properties = {}
      concept_properties['skos:prefLabel'] = meta["content"].first unless meta["content"].blank?
      unless concept_properties.blank?
        type_concept_uri = RDF::URI.parse("europeana19141918:concept/content/" + Digest::MD5.hexdigest(concept_properties.to_yaml))
        graph << [ type_concept_uri, RDF.type, RDF::EDM.Concept ]
        graph << [ type_concept_uri, RDF::SKOS.prefLabel, concept_properties['skos:prefLabel'] ]
        graph << [ puri, RDF::DC.type, type_concept_uri ]
      end
      
      graph << [ puri, RDF::DC.subject, meta["subject"] ] unless meta["subject"].blank?
      graph << [ puri, RDF::DC.alternative, meta["alternative"] ] unless meta["alternative"].blank?
      graph << [ puri, RDF::DC.subject, meta["subject"] ] unless meta["subject"].blank?
      graph << [ puri, RDF::DC.created, meta["date"] ] unless meta["date"].blank?
      graph << [ puri, RDF::DC.extent, meta["page_total"] ] unless meta["page_total"].blank?
      graph << [ puri, RDF::DC.extent, meta["page_number"] ] unless meta["page_number"].blank?
      graph << [ puri, RDF::DC.isPartOf, RDF::URI.parse(contribution.edm_provided_cho_uri) ]
      graph << [ puri, RDF::DC.medium, meta["format"].first ] unless meta["format"].blank?
      graph << [ puri, RDF::DC.provenance, meta["collection_day"].first ] unless meta["collection_day"].blank?
      
      if meta["location_placename"].present? || meta["location_map"].present?
        lat, lng = meta["location_map"].split(',')
        place_id = Digest::MD5.hexdigest(
          { 'wgs84_pos:lat' => lat, 'wgs84_pos:lng' => lng, 'skos:prefLabel' => meta['location_placename'] }.reject { |k, v| v.blank? }.to_yaml
        )
        spatial_place_uri = RDF::URI.parse('europeana19141918:place/' + place_id)
        graph << [ spatial_place_uri, RDF.type, RDF::EDM.Place ]
        graph << [ spatial_place_uri, RDF::GEO.lat, lat ] unless lat.blank?
        graph << [ spatial_place_uri, RDF::GEO.lng, lng ] unless lat.blank?
        graph << [ spatial_place_uri, RDF::SKOS.prefLabel, meta["location_placename"] ] unless meta["location_placename"].blank?
        graph << [ puri, RDF::DC.spatial, spatial_place_uri ]
      end

      if meta["date_from"].present? || meta["date_to"].present? || meta["date"].present?
        time_span_id = Digest::MD5.hexdigest(
          { 'edm:begin' => meta['date_from'], 'edm:end' => meta['date_to'], 'skos:prefLabel' => meta['date'] }.reject { |k, v| v.blank? }.to_yaml
        )
        temporal_time_span_uri = RDF::URI.parse('europeana19141918:timespan/' + time_span_id)
        graph << [ temporal_time_span_uri, RDF.type, RDF::EDM.TimeSpan ]
        graph << [ temporal_time_span_uri, RDF::EDM.begin, meta['date_from'] ] unless meta["date_from"].blank?
        graph << [ temporal_time_span_uri, RDF::EDM.end, meta['date_to'] ] unless meta["date_to"].blank?
        graph << [ temporal_time_span_uri, RDF::SKOS.prefLabel, meta['date'] ] unless meta["date"].blank?
        graph << [ puri, RDF::DC.temporal, temporal_time_span_uri ]
      end
      
      if character1_full_name = Contact.full_name(meta["character1_given_name"], meta["character1_family_name"])
        graph << [ puri, RDF::EDM.hasMet, character1_full_name ]
      else
        graph << [ puri, RDF::EDM.hasMet, meta["date"] ] unless meta["date"].blank?
      end
      graph << [ puri, RDF::EDM.isNextInSequence, RDF::URI.parse(next_in_sequence.edm_provided_cho_uri) ] unless next_in_sequence.blank?
      graph << [ puri, RDF::EDM.realizes, meta["file_type"].first ] unless meta["file_type"].blank?
      graph << [ puri, RDF::EDM.type, meta["file_type"].first ] unless meta["file_type"].blank?
      
      # edm:WebResource
      wuri = RDF::URI.parse(edm_web_resource_uri)
      
      graph << [ wuri, RDF.type, RDF::EDM.WebResource ]
      graph << [ wuri, RDF::DC.description, created_at.to_s ]
      graph << [ wuri, RDF::DC.format, meta["file_type"].first ] unless meta["file_type"].blank?
      graph << [ wuri, RDF::DC.created, created_at.to_s ]
      graph << [ wuri, RDF::EDM.rights, RDF::URI.parse(meta["license"].first) ] unless meta["license"].blank?
      graph << [ wuri, RDF::EDM.isNextInSequence, RDF::URI.parse(next_in_sequence.edm_web_resource_uri) ] unless next_in_sequence.blank?
      
      # ore:Aggregation
      auri = RDF::URI.parse(ore_aggregation_uri)
      
      graph << [ auri, RDF.type, RDF::ORE.Aggregation ]
      graph << [ auri, RDF::EDM.aggregatedCHO, puri ]
      graph << [ auri, RDF::EDM.isShownAt, RDF::URI.parse(contribution.edm_web_resource_uri) ]
      graph << [ auri, RDF::EDM.isShownBy, wuri ]
      graph << [ auri, RDF::EDM.object, wuri ]
      graph << [ auri, RDF::EDM.rights, RDF::URI.parse(meta["license"].first) ] unless meta["license"].blank?
      
      graph
    end
    
    ##
    # The edm:ProvidedCHO URI of this attachment
    #
    # @return [String] URI
    #
    def edm_provided_cho_uri
      @edm_provided_cho_uri ||= RunCoCo.configuration.site_url + file.url(:original, :timestamp => false)
    end
    
    ##
    # The edm:WebResource URI of this attachment
    #
    # @return [String] URI
    #
    def edm_web_resource_uri
      @edm_web_resource_uri ||= RunCoCo.configuration.site_url + file.url(:full, :timestamp => false)
    end
    
    ##
    # The ore:Aggregation URI of this attachment
    #
    # @return [String] URI
    #
    def ore_aggregation_uri
      @ore_aggregation_uri ||= "europeana19141918:aggregation/attachment/" + id.to_s
    end
  end
end
