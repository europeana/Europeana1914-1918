module DropboxHelper
  def dropbox_contents
    if dropbox_authorized?
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
end
