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

  namespace :clear do

    desc "Clears cached minified CSS and JS assets."
    task :assets => :environment do
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

    desc "Clears cached Europeana API data."
    task :europeana => :environment do
      puts "Clearing cached Europeana API data...\n"
      ActionController::Base.new.expire_fragment(/^views\/europeana\//)
    end
  
    desc "Clears cached federated search API data. Limit to one provider with PROVIDER=name."
    task :federated => :environment do
      if provider = ENV['PROVIDER']
        known_providers = [ 'canadiana', 'digitalnz', 'dpla', 'trove' ]
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
    
    desc "Clears cached Bing Translate API results."
    task :bing_translate => :environment do
      print "Clearing cached Bing Translate API results... "
      ActionController::Base.new.expire_fragment(/^views\/bing\//)
      puts "done."
    end
  
    desc "Clears cached rendered search results. Limit to one provider with PROVIDER=name."
    task :search_results => :environment do
      if provider = ENV['PROVIDER']
        known_providers = [ 'contributions', 'europeana', 'canadiana', 'digitalnz', 'dpla', 'trove' ]
        unless known_providers.include?(provider)
          puts "Unknown provider \"#{provider}\"; known providers: " + known_providers.join(', ') + "\n"
          exit 1
        end
        print "Clearing cached rendered search results for provider \"#{provider}\"... "
      else
        print "Clearing cached rendered search results... "
      end
      I18n.available_locales.each do |locale|
        [ "v2.1", "v3" ].each do |theme|
          fragment_pattern = "^views/#{theme}/#{locale}/search/result/"
          fragment_pattern << "#{provider}/" unless provider.blank?
          ActionController::Base.new.expire_fragment(Regexp.new(fragment_pattern))
        end
      end
      puts "done."
    end
    
    namespace :europeana_records do
      desc "Clears cached EuropeanaRecord search result partials. Limit to one theme with THEME=name."
      task :search_results => :environment do
        print "Clearing cached EuropeanaRecord search result partials... "
        themes = [ ENV['THEME'] ] || [ "v2.1", "v3" ]
        EuropeanaRecord.select("id, record_id").find_in_batches do |batch|
          print "."
          batch.each do |er|
            themes.each do |theme|
              I18n.available_locales.each do |locale|
                fragment_key =  "#{theme}/#{locale.to_s}/search/result/collection" + er.record_id.to_s
                ActionController::Base.new.expire_fragment(fragment_key)
              end
            end
          end
        end
        puts " done."
      end
    end
    
    namespace :edm do
      desc "Clears all cached EDM RDF/XML (contributions and attachments)."
      task :all => :environment do
        Rake::Task["cache:clear:edm:contributions"].invoke
        Rake::Task["cache:clear:edm:attachments"].invoke
      end
      
      desc "Clears cached EDM RDF/XML for contributions."
      task :contributions => :environment do
        print "Clearing cached contribution EDM RDF/XML... "
        controller = ActionController::Base.new
        Contribution.select("id").find_in_batches do |batch|
          print "."
          batch.each do |contribution|
            fragment_key = "contributions/xml/#{contribution.id}.xml"
            controller.expire_fragment(fragment_key)
          end
        end
        puts " done."
      end
      
      desc "Clears cached EDM RDF/XML for attachments."
      task :attachments => :environment do
        print "Clearing cached attachment EDM RDF/XML... "
        controller = ActionController::Base.new
        Attachment.select("id").find_in_batches do |batch|
          print "."
          batch.each do |attachment|
            fragment_key = "attachments/xml/#{attachment.id}.xml"
            controller.expire_fragment(fragment_key)
          end
        end
        puts " done."
      end
    end
  
    desc "Clears cached oEmbed responses."
    task :oembed => :environment do
      print "Clearing cached oEmbed responses... "
      ActionController::Base.new.expire_fragment(/^views\/oembed\/response\//)
      puts "done."
    end
  
    desc "Clears cached Google Analytics API results."
    task :google_analytics => :environment do
      print "Clearing cached Google Analytics API results... "
      ActionController::Base.new.expire_fragment(/^views\/google\/api\/analytics\/results$/)
      puts "done."
    end
    
  end # namespace :clear
end
