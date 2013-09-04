module Europeana
  module EDM
    module Mapping
      ##
      # Maps a +Contribution+ to EDM
      #
      class Story < Base
      
        has_rdf_graph_methods :provided_cho, :web_resource, :ore_aggregation
        
        ##
        # The edm:ProvidedCHO URI of this contribution
        #
        # @return [RDF::URI] URI
        #
        def provided_cho_uri
          @provided_cho_uri ||= RDF::URI.parse(RunCoCo.configuration.site_url + "/contributions/" + @source.id.to_s)
        end
        
        ##
        # The edm:WebResource URI of this contribution
        #
        # @return [RDF::URI] URI
        #
        def web_resource_uri
          @web_resource_uri ||= RDF::URI.parse(RunCoCo.configuration.site_url + "/en/contributions/" + @source.id.to_s)
        end
        
        ##
        # The ore:Aggregation URI of this contribution
        #
        # @return [RDF::URI] URI
        #
        def ore_aggregation_uri
          @ore_aggregation_uri ||= RDF::URI.parse("europeana19141918:aggregation/contribution/" + @source.id.to_s)
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
        def as_record
          graph = to_rdf_graph
          record = {}
          
          record["type"] = graph.query(:predicate => RDF::EDM.type).first.object.to_s
          record["title"] = []
          graph.query(:predicate => RDF::DCElement.title) do |solution|
            record["title"] << solution.object.to_s
          end
          graph.query(:predicate => RDF::DC.alternative) do |solution|
            record["title"] << solution.object.to_s
          end
          
          proxy = { }
          graph.query(:subject => provided_cho_uri).each do |statement|
            qname = statement.predicate.qname
            if [ :dc, :edm, :dc_element ].include?(qname.first)
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
          
          record["aggregations"] = [
            { "edmProvider" => { "def" => [ "Europeana 1914 - 1918" ] } }
          ]
          
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
        def as_result(options = {})
          graph = to_rdf_graph
          result = {}
          
          graph.query(:predicate => RDF::DCElement.identifier) do |solution|
            result["id"] = solution.object.to_s
          end
          graph.query(:predicate => RDF::DCElement.title) do |solution|
            result["title"] = [ solution.object.to_s ]
          end
          graph.query(:predicate => RDF::DC.alternative) do |solution|
            result["dctermsAlternative"] = [ solution.object.to_s ]
          end
          if cover_image = @source.attachments.cover_image
            result["edmPreview"] = [ cover_image.thumbnail_url(:preview) ]
          else
            result["edmPreview"] = ""
          end
          result["guid"] = provided_cho_uri.to_s
          result["provider"] = [
            "Europeana 1914 - 1918"
          ]
          
          result
        end
        
        def to_rdfxml
          namespace_prefixes = {
            :dc => "http://purl.org/dc/elements/1.1/",
            :dcterms => "http://purl.org/dc/terms/",
            :edm => "http://www.europeana.eu/schemas/edm/",
            :ore => "http://www.openarchives.org/ore/terms/",
            :skos => "http://www.w3.org/2004/02/skos/core#",
            :geo => "http://www.w3.org/2003/01/geo/wgs84_pos#"
          }
          
          graph = to_rdf_graph
          if @source.attachments.size > 1
            @source.attachments[1..-1].each do |attachment|
              attachment.edm.to_rdf_graph.each do |statement|
                graph << statement
              end
            end
          end
          
          RDF::RDFXML::Writer.buffer(:prefixes => namespace_prefixes, :max_depth => 1) do |writer|
            writer << graph
          end
        end
        
        ##
        # Constructs the edm:ProvidedCHO for this story
        #
        # @return [RDF::Graph] RDF graph of the edm:ProvidedCHO
        #
        def provided_cho
          graph = RDF::Graph.new
          meta = @source.metadata.fields
          uri = provided_cho_uri
          
          graph << [ uri, RDF.type, RDF::EDM.ProvidedCHO ]
          graph << [ uri, RDF::DCElement.identifier, @source.id.to_s ]
          graph << [ uri, RDF::DCElement.title, @source.title ]
          graph << [ uri, RDF::DCElement.date, meta['date'] ] unless meta["date"].blank?
          graph << [ uri, RDF::DC.created, @source.created_at.to_s ]
          graph << [ uri, RDF::EDM.type, "TEXT" ]
          graph << [ uri, RDF::DCElement.description, meta["description"] ] unless meta["description"].blank?
          graph << [ uri, RDF::DCElement.description, meta["summary"] ] unless meta["summary"].blank?
          graph << [ uri, RDF::DCElement.subject, meta["subject"] ] unless meta["subject"].blank?
          graph << [ uri, RDF::DCElement.type, meta["content"].first ] unless meta["content"].blank?
          graph << [ uri, RDF::DCElement.language, meta["lang_other"] ] unless meta["lang_other"].blank?
          graph << [ uri, RDF::DC.alternative, meta["alternative"] ] unless meta["alternative"].blank?
          graph << [ uri, RDF::DC.provenance, meta["collection_day"].first ] unless meta["collection_day"].blank?
          
          unless meta["lang"].blank?
            meta["lang"].each do |lang|
              graph << [ uri, RDF::DCElement.language, lang ]
            end
          end
          
          contributor_full_name = meta["contributor_behalf"].present? ? meta["contributor_behalf"] : @source.contributor.contact.full_name
          unless contributor_full_name.blank?
            EDM::Resource::Agent.new(RDF::SKOS.prefLabel => contributor_full_name).append_to(graph, uri, RDF::DCElement.contributor)
          end
          
          unless meta["creator"].blank?
            EDM::Resource::Agent.new(RDF::SKOS.prefLabel => meta["creator"]).append_to(graph, uri, RDF::DCElement.creator)
          end
          
          [ "keywords", "theatres", "forces" ].each do |subject_field|
            unless meta[subject_field].blank?
              meta[subject_field].each do |subject|
                EDM::Resource::Concept.new(RDF::SKOS.prefLabel => subject).append_to(graph, uri, RDF::DCElement.subject)
              end
            end
          end
          
          character1_full_name = Contact.full_name(meta["character1_given_name"], meta["character1_family_name"])
          unless character1_full_name.blank? && meta['character1_dob'].blank? && meta['character1_dod'].blank?
            EDM::Resource::Concept.new({
              RDF::SKOS.prefLabel => character1_full_name,
              RDF::EDM.begin => meta['character1_dob'],
              RDF::EDM.end => meta['character1_dod']
            }).append_to(graph, uri, RDF::DCElement.subject)
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
              RDF::EDM.end => (meta['date_to'].present? ? meta['date_to'] : meta['date_from']),
              RDF::SKOS.prefLabel => meta['date']
            }).append_to(graph, uri, RDF::DC.temporal)
          end
          
          if @source.attachments.size > 1
            @source.attachments[1..-1].each do |attachment|
              graph << [ uri, RDF::DC.hasPart, RDF::URI.parse(attachment.edm.provided_cho_uri) ]
            end
          end
          
          graph
        end
        
        ##
        # Constructs the edm:WebResource for this story
        #
        # @return [RDF::Graph] RDF graph of the edm:WebResource
        #
        def web_resource
          if @source.attachments.first.present?
            @source.attachments.first.edm.web_resource
          else
            RDF::Graph.new
          end
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
          graph << [ uri, RDF::EDM.aggregatedCHO, provided_cho_uri ]
          graph << [ uri, RDF::EDM.isShownAt, web_resource_uri ]
          graph << [ uri, RDF::EDM.isShownBy, @source.attachments.first.edm.web_resource_uri ] unless @source.attachments.first.blank?
          graph << [ uri, RDF::EDM.rights, RDF::URI.parse("http://creativecommons.org/publicdomain/zero/1.0/") ]
          
          graph
        end
        
      end
    end
  end
end
