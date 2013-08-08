namespace :cache do
  desc "Clean up any expired cached content."
  task :cleanup => :environment do
    if ActionController::Base.new.cache_store.respond_to?(:cleanup)
      puts "Cleaning up expired cached content...\n"
      ActionController::Base.new.cache_store.cleanup
    else
      puts "Cache store does not support cleanup.\n"
      exit 1
    end
  end

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
  
  namespace :federated do
    desc "Clears cached federated search API data. Limit to one provider with PROVIDER=name."
    task :clear => :environment do
      if provider = ENV['PROVIDER']
        known_providers = [ 'digitalnz', 'dpla', 'trove' ]
        unless known_providers.include?(provider)
          puts "Unknown provider \"#{provider}\"; known providers: " + known_providers.join(', ') + "\n"
          exit 1
        end
        puts "Clearing cached federated search API data for provider \"#{provider}\"...\n"
      else
        puts "Clearing cached federated search API data...\n"
      end
      fragment_pattern = "^views/search/federated/"
      fragment_pattern << "#{provider}/" unless provider.blank?
      ActionController::Base.new.expire_fragment(Regexp.new(fragment_pattern))
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
    desc "Clears cached rendered search results. Limit to one provider with PROVIDER=name."
    task :clear => :environment do
      if provider = ENV['PROVIDER']
        known_providers = [ 'contributions', 'europeana', 'digitalnz', 'dpla', 'trove' ]
        unless known_providers.include?(provider)
          puts "Unknown provider \"#{provider}\"; known providers: " + known_providers.join(', ') + "\n"
          exit 1
        end
        puts "Clearing cached rendered search results for provider \"#{provider}\"...\n"
      else
        puts "Clearing cached rendered search results...\n"
      end
      I18n.available_locales.each do |locale|
        [ "v2", "v3" ].each do |theme|
          fragment_pattern = "^views/#{theme}/#{locale}/search/result/"
          fragment_pattern << "#{provider}/" unless provider.blank?
          ActionController::Base.new.expire_fragment(Regexp.new(fragment_pattern))
        end
      end
    end
  end
  
  namespace :oembed do
    desc "Clears cached oEmbed responses."
    task :clear => :environment do
      puts "Clearing cached oEmbed responses...\n"
      ActionController::Base.new.expire_fragment(/^views\/oembed\/response\//)
    end
  end
  
  namespace :google_analytics do
    desc "Clears cached Google Analytics API results."
    task :clear => :environment do
      puts "Clearing cached Google Analytics API results...\n"
      ActionController::Base.new.expire_fragment(/^views\/google\/api\/analytics\/results$/)
    end
  end
end

# Backwards compability
namespace :assets do
  task :expire => :environment do
    Rake::Task["cache:assets:clear"].invoke
  end
end
