require 'oai'

# Custom metadata format 
module OAI::Provider::Metadata
  class Europeana19141918 < Format
    def initialize
      # @todo Remove this and always use www.europeana1914-1918.eu when
      #   schema is published to that host.
      if (schema_host = Rails.application.config.action_mailer.default_url_options[:host]).present?
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
end

class OaiProvider < OAI::Provider::Base
  repository_name RunCoCo.configuration.site_name
  admin_email Devise.mailer_sender
  source_model OAI::Provider::ActiveRecordWrapper.new(::PublishedContribution, { :limit => 100 })
  register_format OAI::Provider::Metadata::Europeana19141918.instance
end

