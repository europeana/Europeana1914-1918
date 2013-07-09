class DropboxController < ApplicationController
  before_filter :check_dropbox_configured
  
  # GET /dropbox/connect
  def connect
    if !params[:oauth_token] then
      dbsession = DropboxSession.new(RunCoCo::Dropbox.app_key, RunCoCo::Dropbox.app_secret)
      session[:dropbox][:session] = dbsession.serialize # Serialize and save this DropboxSession

      # Pass to get_authorize_url a callback url that will return the user here
      redirect_to dbsession.get_authorize_url(dropbox_connect_url(request.query_parameters)), {}, false
    else
      # The user has returned from Dropbox
      dbsession = DropboxSession.deserialize(session[:dropbox][:session])
      dbsession.get_access_token  # We've been authorized, so now request an access_token

      session[:dropbox][:session] = dbsession.serialize
      session[:dropbox][:account_info] = dropbox_client.account_info.to_yaml
      cache_dropbox_metadata
      
      redirect_to root_url
    end
  end
  
  # GET /dropbox/logout
  def disconnect
    session.delete(:dropbox)
    redirect_to root_url
  end
  
  # GET /dropbox/refresh
  def refresh
    raise DropboxAuthError unless dropbox_authorized?
    cache_dropbox_metadata
    redirect_to root_url
  end
  
  protected
  ##
  # Retrieves metadata from Dropbox user's app folder and caches it in their 
  # session.
  #
  # @return (see DropboxClient#metadata)
  #
  def cache_dropbox_metadata
    metadata = {}
    if dropbox_configured? && dropbox_authorized?
      metadata = dropbox_client.metadata('/')
    end
    session[:dropbox][:metadata] = metadata.to_yaml
  end
  
  def check_dropbox_configured
    raise Exception, "Dropbox not configured" unless dropbox_configured?
    session[:dropbox] ||= {}
  end
end
