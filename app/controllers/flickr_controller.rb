# @todo Check user has permission on specified contribution
class FlickrController < ApplicationController
  before_filter :init_flickr, :login_to_flickr
  
  def auth
    if authorized?
      redirect_to :action => :show and return
    end
    
    if session[:flickr][:request_token] && params[:oauth_token] && params[:oauth_verifier]
      token = session[:flickr][:request_token]
      @flickr.get_access_token(token['oauth_token'], token['oauth_token_secret'], params[:oauth_verifier])
      session[:flickr][:access_token] = @flickr.access_token
      session[:flickr][:access_secret] = @flickr.access_secret
      redirect_to :action => :show
    else
      token = @flickr.get_request_token(:oauth_callback => auth_flickr_url)
      @auth_url = @flickr.get_authorize_url(token['oauth_token'], :perms => 'read')
      session[:flickr][:request_token] = token
    end
  end
  
  def select
    page = params[:page] || 1
    per_page = params[:count] || 100
    
    @contribution = Contribution.find_by_id!(params[:contribution_id])
    @photos = @flickr.photos.search(:user_id => @login.id, :page => page, :per_page => per_page)
    
    @photos = WillPaginate::Collection.create(page, per_page, @photos['total']) do |pager|
      pager.replace(@photos.to_a)
    end
  end
  
protected

  def init_session
    super
    session[:flickr] = {} unless session[:flickr].present?
  end

  def init_flickr
    @flickr = FlickRaw::Flickr.new
    
    if session[:flickr][:access_token]
      @flickr.access_token = session[:flickr][:access_token]
    end
    if session[:flickr][:access_secret]
      @flickr.access_secret = session[:flickr][:access_secret]
    end
  end

  def authorized?
    @flickr.access_token && @flickr.access_secret
  end
  
  def login_to_flickr
    if authorized?
      @login = @flickr.test.login
    end
  end

end
