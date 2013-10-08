# Secret token
run "ln -nfs #{config.shared_path}/config/initializers/secret_token.rb #{config.release_path}/config/initializers/secret_token.rb"

# ActionMailer config
run "ln -nfs #{config.shared_path}/config/initializers/action_mailer.rb #{config.release_path}/config/initializers/action_mailer.rb"

# Europeana API
run "ln -nfs #{config.shared_path}/config/initializers/europeana.rb #{config.release_path}/config/initializers/europeana.rb"
