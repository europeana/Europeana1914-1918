module Europeana
  module OAI
    module MetadataFormat
      class Base < ::OAI::Provider::Metadata::Format
        def schema_host
          unless @schema_host.present?
            # @todo Remove this and always use www.europeana1914-1918.eu when
            #   schema is published to that host.
            if (@schema_host = Rails.application.routes.default_url_options[:host].clone).present?
              if (schema_port = Rails.application.routes.default_url_options[:port]).present?
                @schema_host << ":#{schema_port}"
              end
            else
              @schema_host = 'www.europeana1914-1918.eu'
            end
          end
          @schema_host
        end
      end
      
      class EDM < Base
        def initialize
          @prefix = 'oai_edm'
          @schema = "http://www.europeana.eu/schemas/edm/EDM.xsd"
          @namespace = "http://#{schema_host}/oai/oai_edm/"
          @element_namespace = 'edm'
        end

        def header_specification
          {
            'xmlns:oai_edm' => @namespace,
            'xmlns:xsi' => "http://www.w3.org/2001/XMLSchema-instance",
            'xsi:schemaLocation' => @namespace + ' ' + @schema
          }
        end
      end
    end
  end
end
