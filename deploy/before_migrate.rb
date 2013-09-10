# Rails environment
run "ln -nfs #{shared_path}/config/environments/production.rb #{release_path}/config/environments/production.rb"

# Sphinx config
run "ln -nfs #{shared_path}/config/sphinx #{release_path}/config/sphinx" 
run "ln -nfs #{shared_path}/config/sphinx.yml #{release_path}/config/sphinx.yml"

# Devise config
run "ln -nfs #{shared_path}/config/initializers/devise.rb #{release_path}/config/initializers/devise.rb"
