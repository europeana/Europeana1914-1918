namespace :assets do
  # Backwards compability
  task :expire => :environment do
    Rake::Task["cache:assets:clear"].invoke
  end
end
