require 'dropbox_sdk'

class DropboxController < ApplicationController
  # GET /dropbox/login
  def login
    if !params[:oauth_token] then
      dbsession = DropboxSession.new(DROPBOX_APP_KEY, DROPBOX_APP_SECRET)

      session[:dropbox_session] = dbsession.serialize # serialize and save this DropboxSession

      # pass to get_authorize_url a callback url that will return the user here
      require 'cgi' unless defined?(CGI) && defined?(CGI::escape)
      logger.debug("==== " + dbsession.get_authorize_url(CGI.escape(dropbox_login_url(request.query_parameters))))
#      return
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
end
