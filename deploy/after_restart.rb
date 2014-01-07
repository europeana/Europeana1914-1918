# Restart monit workers
run 'sudo monit -g dj_europeana19141918 restart all'
run 'sudo monit -g solr restart all'

# Clear asset cache if required
if [ "app", "app_master" ].include?(config.current_role)
  [
    "public/javascripts",
    "public/stylesheets",
    "public/themes/common",
    "public/themes/v2/javascripts",
    "public/themes/v2/stylesheets",
    "public/themes/v2.1/javascripts",
    "public/themes/v2.1/stylesheets",
    "public/themes/v3/javascripts",
    "public/themes/v3/stylesheets"
  ].each do |asset_path|
    previous_dir = "#{config.previous_release}/#{asset_path}"
    current_dir = "#{config.current_path}/#{asset_path}"
    
    unless `diff -rq #{previous_dir} #{current_dir}`.strip.empty?
      run "cd #{config.release_path}"
      run "bundle exec rake cache:assets:clear"
      break
    end
  end

  # Always preload just to get the app loaded into memory
  run "bundle exec rake assets:preload"
end

# @todo run sunspot:solr:reindex on solr host if app solr/conf directory 
#   changed since last release
