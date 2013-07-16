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
    desc "Clears cached Europeana API data."
    task :clear => :environment do
      puts "Clearing cached Europeana API data...\n"
      ActionController::Base.new.expire_fragment(/^views\/europeana\//)
    end
  end
  
  namespace :bing_translate do
    desc "Clears cached Bing Translate API results."
    task :clear => :environment do
      puts "Clearing cached Bing Translate API results...\n"
      ActionController::Base.new.expire_fragment(/^views\/bing\//)
    end
  end
  
   namespace :search_results do
    desc "Clears cached rendered search results."
    task :clear => :environment do
      puts "Clearing cached rendered search results...\n"
        I18n.available_locales.each do |locale|
          [ "v2", "v3" ].each do |theme|
            ActionController::Base.new.expire_fragment(Regexp.new("^views/#{theme}/#{locale}/search/result/"))
          end
        end
    end
  end
end

# Backwards compability
namespace :assets do
  task :expire => :environment do
    Rake::Task["cache:assets:clear"].invoke
  end
end
