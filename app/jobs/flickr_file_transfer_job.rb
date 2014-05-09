class FlickrFileTransferJob
  def initialize(attachment_id, flickr_access_token, flickr_access_secret, flickr_id)
    @attachment_id = attachment_id
    @flickr_access_token = flickr_access_token
    @flickr_access_secret = flickr_access_secret
    @flickr_id = flickr_id
  end
  
  def perform
    login_to_flickr
    Delayed::Worker.logger.info("FlickrFileTransferJob: Importing Flickr photo with ID #{@flickr_id}")
    info = @flickr.photos.getInfo(:photo_id => @flickr_id)
    url = FlickRaw.url(info)
    uri = URI.parse(url)
    file_name = uri.path.split('/').last
    file = download_photo(uri)
    save_photo(file, file_name)
    delete_tmpfile(file)
  end
  
protected

  def login_to_flickr
    @flickr = FlickRaw::Flickr.new
    @flickr.access_token = @flickr_access_token
    @flickr.access_secret = @flickr_access_secret
    @login = @flickr.test.login
  end
  
  def download_photo(uri)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    
    extname = File.extname(uri.path.split('/').last)
    
    file = Tempfile.new([ 'runcoco-flickr-', extname ], Dir.tmpdir, 'wb')
    file.binmode
    
    http.request_get(uri.request_uri) do |resp|
      resp.read_body do |segment|
        file.write(segment)
      end
    end
    
    file.flush
    file
  end
  
  def save_photo(file, file_name)
    attachment = Attachment.find_by_id!(@attachment_id)
    attachment.file = file
    attachment.file_content_type = file.content_type
    attachment.file_file_name = file_name
    attachment.save!
  end
  
  def delete_tmpfile(file)
    file.close
    file.unlink
  end
end
