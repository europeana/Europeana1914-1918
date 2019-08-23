class OaiController < ApplicationController
  before_filter :init_provider

  def index
    # Log request
    Log.info("oai-pmh", "OAI-PMH provider request from IP #{request.ip}: #{request.fullpath}")

    # Remove controller and action from the options.
    options = params.delete_if { |k,v| %w{controller action}.include?(k) }
    provider = Europeana::OAI::Provider.new
    render :xml => provider.process_request(options)
  end

protected

  # Init provider config from site config and request
  def init_provider
    Europeana::OAI::Provider.url = oai_url(:locale => nil)
    Europeana::OAI::Provider.prefix = 'oai:' + request.host
    Europeana::OAI::Provider.name = RunCoCo.configuration.site_name
    Europeana::OAI::Provider.email = Devise.mailer_sender
    Europeana::OAI::Provider.model = OAI::Provider::ActiveRecordWrapper.new(OAIRecord.where(:metadata_prefix => 'oai_edm'), { :limit => 100 })
  end
end
