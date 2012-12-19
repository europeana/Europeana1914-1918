class OAIController < ApplicationController
  before_filter :init_provider
  
  def index
    # Log request
    RunCoCo.oai_logger.info("OAI-PMH provider request from IP #{request.ip}: #{request.request_uri}")
    
    # Remove controller and action from the options.
    options = params.delete_if { |k,v| %w{controller action}.include?(k) }
    provider = Europeana::OAI::Provider.new
    response =  provider.process_request(options)
    render :text => response, :content_type => 'text/xml'
  end
  
  protected
  # Init provider config from site config and request
  def init_provider
    Europeana::OAI::Provider.url = oai_url(:locale => nil)
    Europeana::OAI::Provider.prefix = 'oai:' + request.host
    Europeana::OAI::Provider.name = RunCoCo.configuration.site_name
    Europeana::OAI::Provider.email = Devise.mailer_sender
    Europeana::OAI::Provider.model = Europeana::OAI::ActiveRecordWrapper.new(OAIRecord, { :limit => 100 })
  end
end
