if config.current_role == :util
  [
    "config/environments",
    "config/initializers",
    "config/s3.yml"
  ].each do |path|
    run "rysnc -av -e \"ssh -o StrictHostKeyChecking=no -i /home/#{config.node[:owner_name]}/.ssh/internal\" #{config.node[:owner_name]}@#{config.node[:master_app_server][:private_dns_name]}:#{shared_path}/#{path} #{shared_path}/#{path}"
  end
end
