# Regenerate i18n JS assets
run "cd #{config.release_path}"
run "bundle exec rake i18n:js:export"

# Restart monit workers
run 'sudo "monit -g dj_europeana19141918 restart all"'
run 'sudo "monit -g sphinx_europeana19141918 restart all"'
