require 'fileutils'

# Copy config files from app master to utility instances
if config.current_role == :util
  [
    "/data/ssmtp/ssmtp.conf",
    "#{config.shared_path}/config/initializers/action_mailer.rb",
    "#{config.shared_path}/config/initializers/devise.rb",
    "#{config.shared_path}/config/initializers/europeana.rb",
    "#{config.shared_path}/config/initializers/paperclip.rb",
    "#{config.shared_path}/config/initializers/secret_token.rb",
    "#{config.shared_path}/config/s3.yml"
  ].each do |config_path|
    config_dir = File.dirname(config_path)
    FileUtils.mkdir(config_dir) unless File.exists?(config_dir)
    run "scp -o StrictHostKeyChecking=no -i /home/#{config.node[:owner_name]}/.ssh/internal #{config.node[:owner_name]}@#{config.node[:master_app_server][:private_dns_name]}:#{config_path} #{config_path}"
  end
end

# Copy config files from app master to app instances
if config.current_role == :app
  [
    "/data/ssmtp/ssmtp.conf"
  ].each do |config_path|
    config_dir = File.dirname(config_path)
    FileUtils.mkdir(config_dir) unless File.exists?(config_dir)
    run "scp -o StrictHostKeyChecking=no -i /home/#{config.node[:owner_name]}/.ssh/internal #{config.node[:owner_name]}@#{config.node[:master_app_server][:private_dns_name]}:#{config_path} #{config_path}"
  end
end

