if File.exists?(flickr_config_filename = Rails.root.join('config/flickr.yml'))
  require 'flickraw'

  flickr_config = YAML.load_file(flickr_config_filename)[Rails.env]

  FlickRaw.api_key = flickr_config['key']
  FlickRaw.shared_secret = flickr_config['secret']
end
