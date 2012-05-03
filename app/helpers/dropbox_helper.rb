module DropboxHelper
  ##
  # Returns a hash of the files in the top-level of the user's Dropbox app
  # folder.
  #
  # Keys are file names, values are paths, i.e. suitable for use as a form 
  # field collection (select/radio/etc).
  #
  # @return Hash top-level Dropbox app folder contents
  #
  def dropbox_contents
    unless @dropbox_contents.present?
      @dropbox_contents = {}
      if session[:dropbox][:metadata].present?
        metadata = YAML::load(session[:dropbox][:metadata])
        if metadata.has_key?('contents')
          metadata['contents'].each do |item|
            if !item['is_dir'] && Attachment.paperclip_content_types.include?(item['mime_type']) && (item['bytes'] <= RunCoCo.configuration.max_upload_size)
              @dropbox_contents[File.basename(item['path'])] = item['path']
            end
          end
        end
      end
    end
    @dropbox_contents
  end
  
  def dropbox_user
    if dropbox_configured? && dropbox_authorized?
      YAML::load(session[:dropbox][:account_info])['display_name']
    else
      ''
    end
  end
end
