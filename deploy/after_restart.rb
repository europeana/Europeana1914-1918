# Restart monit workers
run 'sudo monit -g dj_europeana19141918 restart all'
run 'sudo monit -g sphinx_europeana19141918 restart all'

# Clear asset cache if required
[
  "public/javascripts",
  "public/stylesheets",
  "public/themes/v2/javascripts",
  "public/themes/v2/stylesheets"
].each do |asset_path|
  previous_dir = "#{config.previous_release}/#{asset_path}"
  current_dir = "#{config.current_path}/#{asset_path}"
  
  unless `diff -rq #{previous_dir} #{current_dir}`.strip.empty?
    run "cd #{config.release_path}"
    run "bundle exec rake cache:assets:clear"
    break
  end
end
