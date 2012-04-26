module DropboxHelper
  def dropbox_contents
    if dropbox_configured? && dropbox_authorized?
      dropbox_client.metadata('/')['contents'].collect do |item|
        { 
          'name' => File.basename(item['path']),
          'path' => item['path']
        }
      end
    else
      []
    end
  end
  
  def dropbox_user
    if dropbox_configured? && dropbox_authorized?
      dropbox_client.account_info["display_name"]
    else
      ''
    end
  end
end
