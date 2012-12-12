class OaiController < ApplicationController
  def index
    # Init provider config from request
    OaiProvider.url = oai_url(:locale => nil)
    OaiProvider.prefix = 'oai:' + request.domain
    
    # Remove controller and action from the options.  Rails adds them automatically.
    options = params.delete_if { |k,v| %w{controller action}.include?(k) }
    provider = OaiProvider.new
    response =  provider.process_request(options)
    render :text => response, :content_type => 'text/xml'
  end
end
