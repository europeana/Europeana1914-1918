# Secret token
run "ln -nfs #{shared_path}/config/initializers/secret_token.rb #{release_path}/config/initializers/secret_token.rb"

# ActionMailer config
run "ln -nfs #{shared_path}/config/initializers/action_mailer.rb #{release_path}/config/initializers/action_mailer.rb"

# Europeana API
run "ln -nfs #{shared_path}/config/initializers/europeana.rb #{release_path}/config/initializers/europeana.rb"
