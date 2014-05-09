class FlickrController < ApplicationController
  before_filter :check_flickr_configured, :init_flickr, :login_to_flickr
  before_filter :redirect_to_auth, :unless => :authorized?, :except => [ :auth, :unauth, :show ]
  
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
      token = @flickr.get_request_token(:oauth_callback => auth_flickr_url(:redirect => params.delete(:redirect)))
      session[:flickr][:request_token] = token
      redirect_to @flickr.get_authorize_url(token['oauth_token'], :perms => 'read')
    end
  end
  
  def unauth
    session[:flickr] = {}
    redirect_to :action => :show
  end
  
  def show
    
  end
  
  def select
    page = params[:page] || 1
    per_page = params[:count] || 100
    
    @contribution = Contribution.find_by_id!(params[:contribution_id])
    current_user.may_create_contribution_attachment!(@contribution)
    
    @flickr_query = params[:q] || ''
    
    @photos = @flickr.photos.search(:user_id => @login.id, :text => @flickr_query, :page => page, :per_page => per_page)
    
    @photos = WillPaginate::Collection.create(page, per_page, @photos['total']) do |pager|
      pager.replace(@photos.to_a)
    end
  end
  
  def import
    @contribution = Contribution.find_by_id!(params[:contribution_id])
    current_user.may_create_contribution_attachment!(@contribution)
    
    unless params[:flickr_ids].present?
      flash[:alert] = 'No images selected'
      redirect_to :action => :select and return
    end
    
    params[:flickr_ids].each do |photo_id|
      info = @flickr.photos.getInfo(:photo_id => photo_id)
      
      url = FlickRaw.url(info)
      uri = URI.parse(url)
      
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      head_response = http.request_head(uri.request_uri)
      
      attachment = Attachment.new
      attachment.contribution_id = @contribution.id
      attachment.title = info.title
      attachment.build_metadata
      attachment.metadata.field_attachment_description = info.description
      attachment.file_file_size = head_response['content-length']
      
      if attachment.save
        Delayed::Job.enqueue FlickrFileTransferJob.new(attachment.id, @flickr.access_token, @flickr.access_secret, photo_id), :queue => 'flickr'
      end
    end
    
    flash[:notice] = 'Transferring Flickr images in the background.'
    redirect_to new_contribution_attachment_path(@contribution)
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
    @flickr.access_token.present? && @flickr.access_secret.present?
  end
  
  def login_to_flickr
    if authorized?
      @login = @flickr.test.login
    end
  end
  
  def redirect_to_auth
    redirect_to :action => :auth, :redirect => request.fullpath
  end
  
  def check_flickr_configured
    raise Exception, "Flickr API access is not configured" unless flickr_configured?
  end

end
