require 'oai'

# Custom metadata format 
module OAI::Provider::Metadata
  class Europeana < Format
    def initialize
      @prefix = 'oai_europeana'
      @schema = nil
      @namespace = nil
      @element_namespace = 'europeana'
    end
  end
end

class OaiProvider < OAI::Provider::Base
  repository_name RunCoCo.configuration.site_name
  admin_email Devise.mailer_sender
  source_model OAI::Provider::ActiveRecordWrapper.new(::PublishedContribution, { :limit => 100 })
  register_format OAI::Provider::Metadata::Europeana.instance
end

