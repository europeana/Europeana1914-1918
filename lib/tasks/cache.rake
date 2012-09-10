namespace :cache do
  namespace :assets do
    desc "Clears cached minified CSS and JS assets."
    task :clear => :environment do
      [
        File.join(Rails.root, 'public', 'cache', 'javascripts', '*.js'),
        File.join(Rails.root, 'public', 'cache', 'stylesheets', '*.css')
      ].each do |pattern|
        puts "Removing files \"#{pattern}\"...\n"
        Dir.glob(pattern).each do |path|
          puts "  " + File.basename(path) + "\n"
          File.delete(path)
        end
      end
    end
  end
  
  namespace :europeana do
    desc "Clears cached Europeana OpenSearch API results."
    task :clear => :environment do
      puts "Clearing cached Europeana OpenSearch API results...\n"
      ActionController::Base.new.expire_fragment(/views\/europeana\//)
    end
  end
  
  namespace :bing_translate do
    desc "Clears cached Bing Translate API results."
    task :clear => :environment do
      puts "Clearing cached Bing Translate API results...\n"
      ActionController::Base.new.expire_fragment(/views\/bing\//)
    end
  end
end

# Backwards compability
namespace :assets do
  task :expire => :environment do
    Rake::Task["cache:assets:clear"].invoke
  end
end
