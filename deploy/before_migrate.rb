# Devise config
run "ln -nfs #{config.shared_path}/config/initializers/devise.rb #{config.release_path}/config/initializers/devise.rb"

# S3 config
run "ln -nfs #{config.shared_path}/config/s3.yml #{config.release_path}/config/s3.yml"

# Federated search config
run "ln -nfs #{config.shared_path}/config/federated_search.yml #{config.release_path}/config/federated_search.yml"

# Google API key
run "ln -nfs #{config.shared_path}/config/google_api_key.p12 #{config.release_path}/config/google_api_key.p12"

# Sunspot config
run "ln -nfs #{config.shared_path}/config/sunspot.yml #{config.release_path}/config/sunspot.yml"

# Flickr config
run "ln -nfs #{config.shared_path}/config/flickr.yml #{config.release_path}/config/flickr.yml"

# Paperclip config
run "ln -nfs #{config.shared_path}/config/initializers/paperclip.rb #{config.release_path}/config/initializers/paperclip.rb"

# Asset cache
run "mkdir -p #{config.shared_path}/assets"
run "ln -nfs #{config.shared_path}/assets #{config.release_path}/public/cache"

# Sitemaps
run "mkdir -p #{config.shared_path}/sitemaps"
run "ln -nfs #{config.shared_path}/sitemaps #{config.release_path}/public/sitemaps"
run "ln -nfs #{config.shared_path}/sitemaps/sitemap.xml.gz #{config.release_path}/public/sitemap.xml.gz"

# Tmp files
run "mkdir -p #{config.shared_path}/tmp_files"
run "ln -nfs #{config.shared_path}/tmp_files #{config.release_path}/tmp/files"
