require 'fileutils'

# Copy config files from app master to utility instances
if config.current_role == :util
  [
    "config/initializers/action_mailer.rb",
    "config/initializers/devise.rb",
    "config/initializers/europeana.rb",
    "config/initializers/paperclip.rb",
    "config/initializers/secret_token.rb",
    "config/s3.yml"
  ].each do |config_filename|
    config_path = "#{config.shared_path}/#{config_filename}"
    config_dir = File.dirname(config_path)
    FileUtils.mkdir(config_dir) unless File.exists?(config_dir)
    run "scp -o StrictHostKeyChecking=no -i /home/#{config.node[:owner_name]}/.ssh/internal #{config.node[:owner_name]}@#{config.node[:master_app_server][:private_dns_name]}:#{config_path} #{config_path}"
  end
end
