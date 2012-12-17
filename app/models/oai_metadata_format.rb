require 'oai'

##
# Custom OAI metadata format 
#
class OaiMetadataFormat < OAI::Provider::Metadata::Format
  def initialize
    # @todo Remove this and always use www.europeana1914-1918.eu when
    #   schema is published to that host.
    if (schema_host = Rails.application.config.action_mailer.default_url_options[:host].clone).present?
      if (schema_port = Rails.application.config.action_mailer.default_url_options[:port]).present?
        schema_host << ":#{schema_port}" 
      end
    else 
      schema_host = 'www.europeana1914-1918.eu'
    end
    
    @prefix = 'oai_europeana19141918'
    @schema = "http://#{schema_host}/oai/oai_europeana19141918.xsd"
    @namespace = "http://#{schema_host}/oai/oai_europeana19141918/"
    @element_namespace = 'europeana19141918'
  end
  
  def header_specification
    {
      'xmlns:oai_europeana19141918' => @namespace,
      'xmlns:xsi' => "http://www.w3.org/2001/XMLSchema-instance",
      'xsi:schemaLocation' => @namespace + ' ' + @schema
    }
  end
end
