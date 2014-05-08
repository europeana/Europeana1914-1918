class FlickrFileTransferJob
  def initialize(contribution_id, flickr_access_token, flickr_access_secret, flickr_ids)
    @contribution_id = contribution_id
    @flickr_access_token = flickr_access_token
    @flickr_access_secret = flickr_access_secret
    @flickr_ids = flickr_ids
  end
  
  def perform
    contribution = Contribution.find_by_id!(@contribution_id)
    login_to_flickr
    
    @flickr_ids.each do |id|
      puts "Flickr photo ID #{id}"
      info = @flickr.photos.getInfo(:photo_id => id)
      url = FlickRaw.url(info)
      file = download_photo(url)
      create_attachment(file)
      delete_tmpfile(file)
    end
  end
  
protected

  def login_to_flickr
    @flickr = FlickRaw::Flickr.new
    @flickr.access_token = @flickr_access_token
    @flickr.access_secret = @flickr_access_secret
    @login = @flickr.test.login
  end
  
  def download_photo(url)
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    
    file = Tempfile.new('runcoco-flickr-', Dir.tmpdir, 'wb')
    file.binmode
    
    http.request_get(uri.request_uri) do |resp|
      resp.read_body do |segment|
        file.write(segment)
      end
    end
    
    file.flush
    file
  end
  
  def create_attachment(file)
    attachment = Attachment.new
    attachment.build_metadata
    attachment.contribution_id = @contribution_id
    attachment.file = file
    attachment.file_content_type = file.content_type
    attachment.save!
  end
  
  def delete_tmpfile(file)
    file.close
    file.unlink
  end
end
