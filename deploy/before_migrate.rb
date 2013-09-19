# Rails environment
run "ln -nfs #{shared_path}/config/environments/production.rb #{release_path}/config/environments/production.rb"

# Sphinx config
run "ln -nfs #{shared_path}/config/sphinx #{release_path}/config/sphinx" 
run "ln -nfs #{shared_path}/config/sphinx.yml #{release_path}/config/sphinx.yml"
run "ln -nfs #{shared_path}/config/initializers/thinking_sphinx.rb #{release_path}/config/initializers/thinking_sphinx.rb"

# Devise config
run "ln -nfs #{shared_path}/config/initializers/devise.rb #{release_path}/config/initializers/devise.rb"

# S3 config
run "ln -nfs #{shared_path}/config/s3.yml #{release_path}/config/config/s3.yml"

# Paperclip config
run "ln -nfs #{shared_path}/config/initializers/paperclip.rb #{release_path}/config/initializers/paperclip.rb"
