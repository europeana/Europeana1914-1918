# Regenerate i18n JS assets
run "cd #{release_path}"
run "bundle exec rake i18n:js:export"
