class FlickrController < ApplicationController
  before_filter :check_flickr_configured, :init_flickr, :login_to_flickr
  before_filter :redirect_to_auth, :unless => :authorized?, :except => [ :auth, :unauth, :show ]
  helper_method :flickr_license_permitted?
  
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
    
    @photos = @flickr.photos.search(:user_id => @login.id, :text => @flickr_query, :page => page, :per_page => per_page, :extras => 'license')
    
    @photos = WillPaginate::Collection.create(page, per_page, @photos['total']) do |pager|
      pager.replace(@photos.to_a)
    end
  end
  
  def import
    @contribution = Contribution.find_by_id!(params[:contribution_id])
    current_user.may_create_contribution_attachment!(@contribution)
    
    unless params[:flickr_ids].present?
      flash[:alert] = I18n.t('flash.flickr.import.alert.empty')
      redirect_to :action => :select and return
    end
    
    invalid_license_photos = []
    
    params[:flickr_ids].each do |photo_id|
      info = @flickr.photos.getInfo(:photo_id => photo_id)
      
      if flickr_license_permitted?(info)
      
        url = FlickRaw.url(info)
        uri = URI.parse(url)
        
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        head_response = http.request_head(uri.request_uri)
        
        attachment = Attachment.new
        attachment.contribution_id = @contribution.id
        attachment.title = info.title
        attachment.file_file_size = head_response['content-length']
        
        attachment.build_metadata
        attachment.metadata.field_attachment_description = info.description
        attachment.metadata.field_file_type_terms = [ MetadataField.find_by_name('file_type').taxonomy_terms.find_by_term('IMAGE') ]

        local_license = case info.license.to_i
        when 5
          'https://creativecommons.org/licenses/by-sa/2.0/'
        when 7
          'http://creativecommons.org/publicdomain/mark/1.0/'
        end
        attachment.metadata.field_license_terms = [ MetadataField.find_by_name('license').taxonomy_terms.find_by_term(local_license) ]

        
        if attachment.save
          Delayed::Job.enqueue FlickrFileTransferJob.new(attachment.id, @flickr.access_token, @flickr.access_secret, photo_id), :queue => 'flickr'
        end
      
      else
        
        invalid_license_photos << info.title
        
      end
    end
    
    flash[:notice] = I18n.t('flash.flickr.import.notice')
    
    unless invalid_license_photos.blank?
      flash[:alert] = '<p>' + Ia8n.t('flash.flickr.import.alert.invalid_license') + '</p>'
      flash[:alert] << '<ul>'
      flash[:alert] << invalid_license_photos.collect { |title| "<li>#{title}</li>" }.join('')
      flash[:alert] << '</ul>'
    end
    
    redirect_to new_contribution_attachment_path(@contribution)
  end
  
  # @see https://www.flickr.com/services/api/flickr.photos.licenses.getInfo.html
  def flickr_license_permitted?(photo)
    # 4: Attribution License
    # 5: Attribution-ShareAlike License
    # 7: No known copyright restrictions
    [ 5, 7 ].include?(photo.license.to_i)
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
