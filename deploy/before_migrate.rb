# Sphinx config
run "ln -nfs #{config.shared_path}/config/sphinx #{config.release_path}/config/sphinx" 
run "ln -nfs #{config.shared_path}/config/sphinx.yml #{config.release_path}/config/sphinx.yml"
run "ln -nfs #{config.shared_path}/config/initializers/thinking_sphinx.rb #{config.release_path}/config/initializers/thinking_sphinx.rb"

# Devise config
run "ln -nfs #{config.shared_path}/config/initializers/devise.rb #{config.release_path}/config/initializers/devise.rb"

# S3 config
run "ln -nfs #{config.shared_path}/config/s3.yml #{config.release_path}/config/config/s3.yml"

# Paperclip config
run "ln -nfs #{config.shared_path}/config/initializers/paperclip.rb #{config.release_path}/config/initializers/paperclip.rb"

# Asset cache
run "mkdir -p #{config.shared_path}/assets"
run "ln -nfs #{config.shared_path}/assets #{config.release_path}/public/cache"
