class DropboxController < ApplicationController
  before_filter :check_dropbox_configured
  
  # GET /dropbox/login
  def login
    if !params[:oauth_token] then
      dbsession = DropboxSession.new(RunCoCo::Dropbox.app_key, RunCoCo::Dropbox.app_secret)

      session[:dropbox_session] = dbsession.serialize # serialize and save this DropboxSession

      # pass to get_authorize_url a callback url that will return the user here
      require 'cgi' unless defined?(CGI) && defined?(CGI::escape)

      redirect_to dbsession.get_authorize_url(dropbox_login_url(request.query_parameters)), {}, false
    else
      # the user has returned from Dropbox
      dbsession = DropboxSession.deserialize(session[:dropbox_session])
      dbsession.get_access_token  # we've been authorized, so now request an access_token
      session[:dropbox_session] = dbsession.serialize

      redirect_to root_url
    end
  end
  
  # GET /dropbox/login
  def logout
    session.delete(:dropbox_session)
    redirect_to root_url
  end
  
  protected
  def check_dropbox_configured
    raise Exception, "Dropbox not configured" unless dropbox_configured?
  end
end
