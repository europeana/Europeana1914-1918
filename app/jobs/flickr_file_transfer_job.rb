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
      Delayed::Worker.logger.info("FlickrFileTransferJob: Importing Flickr photo with ID #{id}")
      info = @flickr.photos.getInfo(:photo_id => id)
      url = FlickRaw.url(info)
      uri = URI.parse(url)
      file_name = uri.path.split('/').last
      file = download_photo(uri)
      create_attachment(file, file_name, info)
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
  
  def create_attachment(file, file_name, info)
    attachment = Attachment.new
    attachment.build_metadata
    attachment.title = info.title
    attachment.metadata.field_attachment_description = info.description
    attachment.contribution_id = @contribution_id
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
