module EDM
  ##
  # Contains methods for conversion of a +Contribution+ to an EDM "story"
  #
  module Story
    def self.included(base)
      base.class_eval do
        include EDM::Base
        has_rdf_graph_methods :edm_provided_cho, :edm_web_resource, :ore_aggregation
      end
    end
    
    ##
    # The edm:ProvidedCHO URI of this contribution
    #
    # @return [RDF::URI] URI
    #
    def edm_provided_cho_uri
      @edm_provided_cho_uri ||= RDF::URI.parse(RunCoCo.configuration.site_url + "/contributions/" + id.to_s)
    end
    
    ##
    # The edm:WebResource URI of this contribution
    #
    # @return [RDF::URI] URI
    #
    def edm_web_resource_uri
      @edm_web_resource_uri ||= RDF::URI.parse(RunCoCo.configuration.site_url + "/en/contributions/" + id.to_s)
    end
    
    ##
    # The ore:Aggregation URI of this contribution
    #
    # @return [RDF::URI] URI
    #
    def ore_aggregation_uri
      @ore_aggregation_uri ||= RDF::URI.parse("europeana19141918:aggregation/contribution/" + id.to_s)
    end
    
    ##
    # Constructs a hash representing this story as an EDM record from its RDF 
    # graph.
    #
    # Equivalent to the +object+ part of the response to a Europeana API
    # Record query.
    #
    # @return [Hash] Representation of EDM metadata record
    # @see http://www.europeana.eu/portal/api-record-json.html
    #
    def to_edm_record
      graph = to_rdf_graph
      record = {}
      
      record["type"] = graph.query(:predicate => RDF::EDM.type).first.object.to_s
      record["title"] = []
      graph.query(:predicate => RDF::DC.title) do |solution|
        record["title"] << solution.object.to_s
      end
      graph.query(:predicate => RDF::DC.alternative) do |solution|
        record["title"] << solution.object.to_s
      end
      
      proxy = { }
      graph.query(:subject => edm_provided_cho_uri).each do |statement|
        qname = statement.predicate.qname
        if [ :dc, :edm ].include?(qname.first)
          field_name = qname.first.to_s + qname.last.to_s[0].upcase + qname.last.to_s[1..-1]
          field_label = statement_label(graph, statement)
          
          if statement.predicate.to_s.match(RDF::EDM.type)
            proxy[field_name] = field_label
          elsif proxy.has_key?(field_name)
            proxy[field_name]["def"] << field_label
          else
            proxy[field_name] = { "def" => [ field_label ] }
          end
        end
      end
      record["proxies"] = [ proxy ]
      
      record["providedCHOs"] = [ { "about" => edm_provided_cho_uri.to_s } ]
      
      record
    end
    
    ##
    # Returns a partial EDM record for the contribution, for use in search 
    # results.
    #
    # This is equivalent to one +item+ in the Europeana API search response.
    #
    # @return [Hash] Partial EDM record for this story
    # @see http://www.europeana.eu/portal/api-search-json.html#item
    #
    def to_edm_result(options = {})
      graph = to_rdf_graph
      result = {}
      
      graph.query(:predicate => RDF::DC.identifier) do |solution|
        result["id"] = solution.object.to_s
      end
      graph.query(:predicate => RDF::DC.title) do |solution|
        result["title"] = solution.object.to_s
      end
      graph.query(:predicate => RDF::DC.alternative) do |solution|
        result["dctermsAlternative"] = solution.object.to_s
      end
      result["edmPreview"] = [ attachments.cover_image.thumbnail_url(:preview) ]
      result["guid"] = edm_provided_cho_uri.to_s
      
      result
    end
    
    ##
    # Constructs the edm:ProvidedCHO for this story
    #
    # @return [RDF::Graph] RDF graph of the edm:ProvidedCHO
    #
    def edm_provided_cho
      graph = RDF::Graph.new
      meta = metadata.fields
      uri = edm_provided_cho_uri
      
      graph << [ uri, RDF.type, RDF::EDM.ProvidedCHO ]
      graph << [ uri, RDF::DC.identifier, id.to_s ]
      graph << [ uri, RDF::DC.title, title ]
      graph << [ uri, RDF::DC.type, RDF::DCMIType.Text ]
      graph << [ uri, RDF::DC.date, created_at.to_s ]
      graph << [ uri, RDF::DC.created, created_at.to_s ]
      graph << [ uri, RDF::EDM.type, "TEXT" ]
      
      contributor_full_name = meta["contributor_behalf"].present? ? meta["contributor_behalf"] : contributor.contact.full_name
      agent_properties = {}
      agent_properties['skos:prefLabel'] = contributor_full_name unless contributor_full_name.blank?
      unless agent_properties.blank?
        contributor_agent_uri = RDF::URI.parse("europeana19141918:agent/" + Digest::MD5.hexdigest(agent_properties.to_yaml))
        graph << [ contributor_agent_uri, RDF.type, RDF::EDM.Agent ]
        graph << [ contributor_agent_uri, RDF::SKOS.prefLabel, agent_properties['skos:prefLabel'] ] unless agent_properties['skos:prefLabel'].blank?
        graph << [ uri, RDF::DC.contributor, contributor_agent_uri ]
      end
      
      agent_properties = {}
      agent_properties['skos:prefLabel'] = meta["creator"] unless meta["creator"].blank?
      unless agent_properties.blank?
        creator_agent_uri = RDF::URI.parse("europeana19141918:agent/" + Digest::MD5.hexdigest(agent_properties.to_yaml))
        graph << [ creator_agent_uri, RDF.type, RDF::EDM.Agent ]
        graph << [ creator_agent_uri, RDF::SKOS.prefLabel, agent_properties['skos:prefLabel'] ] unless agent_properties['skos:prefLabel'].blank?
        graph << [ uri, RDF::DC.creator, creator_agent_uri ]
      end
      
      graph << [ uri, RDF::DC.description, meta["description"] ] unless meta["description"].blank?
      graph << [ uri, RDF::DC.description, meta["summary"] ] unless meta["summary"].blank?
      [ "keywords", "theatres", "forces" ].each do |subject_field|
        unless meta[subject_field].blank?
          meta[subject_field].each do |subject|
            concept_properties = {}
            concept_properties['skos:prefLabel'] = subject unless subject.blank?
            unless concept_properties.blank?
              subject_concept_uri = RDF::URI.parse("europeana19141918:concept/#{subject_field}/" + Digest::MD5.hexdigest(concept_properties.to_yaml))
              graph << [ subject_concept_uri, RDF.type, RDF::EDM.Concept ]
              graph << [ subject_concept_uri, RDF::SKOS.prefLabel, concept_properties['skos:prefLabel'] ]
              graph << [ uri, RDF::DC.subject, subject_concept_uri ]
            end
          end
        end
      end
      graph << [ uri, RDF::DC.subject, meta["subject"] ] unless meta["subject"].blank?
        
      character1_full_name = Contact.full_name(meta["character1_given_name"], meta["character1_family_name"])
      agent_properties = {}
      agent_properties['edm:begin'] = meta['character1_dob'] unless meta['character1_dob'].blank?
      agent_properties['edm:end'] = meta['character1_dod'] unless meta['character1_dod'].blank?
      agent_properties['skos:prefLabel'] = character1_full_name unless character1_full_name.blank?
      unless agent_properties.blank?
        subject_agent_uri = RDF::URI.parse("europeana19141918:agent/" + Digest::MD5.hexdigest(agent_properties.to_yaml))
        graph << [ subject_agent_uri, RDF.type, RDF::EDM.Agent ]
        graph << [ subject_agent_uri, RDF::EDM.begin, agent_properties['edm:begin'] ] unless agent_properties['edm:begin'].blank?
        graph << [ subject_agent_uri, RDF::EDM.end, agent_properties['edm:end'] ] unless agent_properties['edm:end'].blank?
        graph << [ subject_agent_uri, RDF::SKOS.prefLabel, agent_properties['skos:prefLabel'] ] unless agent_properties['skos:prefLabel'].blank?
        graph << [ uri, RDF::DC.subject, subject_agent_uri ]
      end
      
      graph << [ uri, RDF::DC.type, meta["content"].first ] unless meta["content"].blank?
      unless meta["lang"].blank?
        meta["lang"].each do |lang|
          graph << [ uri, RDF::DC.language, lang ]
        end
      end
      graph << [ uri, RDF::DC.language, meta["lang_other"] ] unless meta["lang_other"].blank?
      graph << [ uri, RDF::DC.alternative, meta["alternative"] ] unless meta["alternative"].blank?
      graph << [ uri, RDF::DC.provenance, meta["collection_day"].first ] unless meta["collection_day"].blank?
      
      lat, lng = meta["location_map"].split(',')
      place_properties = {}
      place_properties['wgs84_pos:lat'] = lat.to_f unless lat.blank?
      place_properties['wgs84_pos:lng'] = lng.to_f unless lng.blank?
      place_properties['skos:prefLabel'] = meta['location_placename'] unless meta['location_placename'].blank?
      unless place_properties.blank?
        spatial_place_uri = RDF::URI.parse('europeana19141918:place/' + Digest::MD5.hexdigest(place_properties.to_yaml))
        graph << [ spatial_place_uri, RDF.type, RDF::EDM.Place ]
        graph << [ spatial_place_uri, RDF::GEO.lat, place_properties['wgs84_pos:lat'] ] unless place_properties['wgs84_pos:lat'].blank?
        graph << [ spatial_place_uri, RDF::GEO.lng, place_properties['wgs84_pos:lng'] ] unless place_properties['wgs84_pos:lng'].blank?
        graph << [ spatial_place_uri, RDF::SKOS.prefLabel, place_properties['skos:prefLabel'] ] unless place_properties['skos:prefLabel'].blank?
        graph << [ uri, RDF::DC.spatial, spatial_place_uri ]
      end
      
      time_span_properties = {}
      time_span_properties['edm:begin'] = meta['date_from'] unless meta['date_from'].blank?
      time_span_properties['edm:end'] = meta['date_to'] unless meta['date_to'].blank?
      time_span_properties['skos:prefLabel'] = meta['date'] unless meta['date'].blank?
      unless time_span_properties.blank?
        temporal_time_span_uri = RDF::URI.parse('europeana19141918:timespan/' + Digest::MD5.hexdigest(time_span_properties.to_yaml))
        graph << [ temporal_time_span_uri, RDF.type, RDF::EDM.TimeSpan ]
        graph << [ temporal_time_span_uri, RDF::EDM.begin, meta['date_from'] ] unless meta["date_from"].blank?
        graph << [ temporal_time_span_uri, RDF::EDM.end, meta['date_to'] ] unless meta["date_to"].blank?
        graph << [ temporal_time_span_uri, RDF::SKOS.prefLabel, meta['date'] ] unless meta["date"].blank?
        graph << [ uri, RDF::DC.temporal, temporal_time_span_uri ]
      end
      
      attachments.each do |attachment|
        graph << [ uri, RDF::DC.hasPart, RDF::URI.parse(attachment.edm_provided_cho_uri) ]
      end
      
      graph
    end
    
    ##
    # Constructs the edm:WebResource for this story
    #
    # @return [RDF::Graph] RDF graph of the edm:WebResource
    #
    def edm_web_resource
      graph = RDF::Graph.new
      meta = metadata.fields
      uri = edm_web_resource_uri
      
      graph << [ uri, RDF.type, RDF::EDM.WebResource ]
      graph << [ uri, RDF::DC.description, created_at.to_s ]
      graph << [ uri, RDF::DC.format, "TEXT" ]
      graph << [ uri, RDF::DC.created, created_at.to_s ]
      graph << [ uri, RDF::DC.created, meta["collection_day"].first ] unless meta["collection_day"].blank?
      graph << [ uri, RDF::EDM.rights, RDF::URI.parse("http://creativecommons.org/publicdomain/zero/1.0/") ]
      
      graph
    end
    
    ##
    # Constructs the ore:Aggregation for this story
    #
    # @return [RDF::Graph] RDF graph of the ore:Aggregation
    #
    def ore_aggregation
      graph = RDF::Graph.new
      uri = ore_aggregation_uri
      
      graph << [ uri, RDF.type, RDF::ORE.Aggregation ]
      graph << [ uri, RDF::EDM.aggregatedCHO, edm_provided_cho_uri ]
      graph << [ uri, RDF::EDM.isShownAt, edm_web_resource_uri ]
      graph << [ uri, RDF::EDM.isShownBy, edm_web_resource_uri ]
      graph << [ uri, RDF::EDM.rights, RDF::URI.parse("http://creativecommons.org/publicdomain/zero/1.0/") ]
      
      graph
    end
  
  end
end
