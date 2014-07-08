username = config.node[:users].first[:username]

# Copy config files from app master to app and utility instances
if [ "app", "util" ].include?(config.current_role)
  [
    "#{config.shared_path}/config/initializers/action_mailer.rb",
    "#{config.shared_path}/config/initializers/devise.rb",
    "#{config.shared_path}/config/initializers/europeana.rb",
    "#{config.shared_path}/config/initializers/localeapp.rb",
    "#{config.shared_path}/config/initializers/paperclip.rb",
    "#{config.shared_path}/config/initializers/secret_token.rb",
    "#{config.shared_path}/config/federated_search.yml",
    "#{config.shared_path}/config/google_api_key.p12",
    "#{config.shared_path}/config/s3.yml",
    "#{config.shared_path}/config/flickr.yml",
    "#{config.shared_path}/config/ssmtp/ssmtp.conf"
  ].each do |config_path|
    run "mkdir -p " + File.dirname(config_path)
    run "scp -o StrictHostKeyChecking=no -i /home/#{username}/.ssh/internal #{username}@#{config.node[:master_app_server][:private_dns_name]}:#{config_path} #{config_path}"
  end
end
