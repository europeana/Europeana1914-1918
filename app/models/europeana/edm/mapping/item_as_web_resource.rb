module Europeana
  module EDM
    module Mapping
      ##
      # Maps an +Attachment+ to EDM web resource
      #
      # For items with scarce metadata distinct from parent story's.
      class ItemAsWebResource < Item
        has_rdf_graph_methods :web_resource

        ##
        # Constructs the edm:WebResource for this item
        #
        # @return [RDF::Graph] RDF graph of the edm:WebResource
        def web_resource
          graph = RDF::Graph.new
          meta = @source.metadata.fields
          uri = web_resource_uri
          
          graph << [ uri, RDF.type, RDF::EDM.WebResource ]
          graph << [ uri, RDF::DCElement.format, meta["file_type"].first ] unless meta["file_type"].blank?
          graph << [ uri, RDF::DC.created, @source.created_at.to_s ]
          graph << [ uri, RDF::EDM.rights, RDF::URI.parse(meta["license"].first) ] unless meta["license"].blank?

          if @source.has_distinct_title?
            graph << [ uri, RDF::DCElement.description, @source.title ]
          end

          if @source.has_distinct_metadata_field?("attachment_description", "description")
            graph << [ uri, RDF::DCElement.description, meta["attachment_description"] ]
          end

          # Fields story may also have, to description
          ["lang", "lang_other", "location_placename", "location_map", "keywords", "forces", "theatres", "extended_subjects"].each do |field_name|
            if @source.has_distinct_metadata_field?(field_name)
              [meta[field_name]].flatten.each do |value|
                graph << [ uri, RDF::DCElement.description, value ]
              end
            end
          end

          if @source.has_distinct_metadata_field?("creator")
            graph << [ uri, RDF::DCElement.creator, meta["creator"] ]
          end

          creator_name = [ meta["creator_given_name"], meta["creator_family_name"] ].compact.join(' ')
          unless creator_name.blank?
            graph << [ uri, RDF::DCElement.creator, creator_name ]
          end

          graph << [ uri, RDF::DCElement.source, meta["source"].first ] unless meta["source"].blank?
          graph << [ uri, RDF::DCElement.format, meta["format"].first ] unless meta["format"].blank?
          graph << [ uri, RDF::DC.extent, meta["page_number"] ] unless meta["page_total"].blank?
          graph << [ uri, RDF::DC.extent, meta["page_total"] ] unless meta["page_total"].blank?

          unless meta["content"].blank?
            meta["content"].each do |content|
              graph << [ uri, RDF::DCElement.description, content ]
            end
          end

          ["subject", "object_side"].each do |field_name|
            [meta[field_name]].flatten.each do |value|
              graph << [ uri, RDF::DCElement.description, value ] unless value.blank?
            end
          end

          ["date", "date_from", "date_to"].each do |date_field|
            graph << [ uri, RDF::DC.created, meta[date_field] ] unless meta[date_field].blank?
          end

          # Link to the parent story's ore:aggregation with edm:hasView
          graph << [ @source.contribution.edm.ore_aggregation_uri, RDF::EDM.hasView, web_resource_uri ]

          graph
        end
      end
    end
  end
end
