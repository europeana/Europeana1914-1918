namespace :auto_complete do
  desc "Get phrases from the collection metadata."
  task :phrases => :environment do
    puts "Getting auto-complete phrases from collection metadata..."
    count = SearchSuggestion.from_collection_metadata!
    puts "Got #{count} auto-complete phrases."
  end
  
  namespace :stops do
    desc "Import auto-complete words from the stop words file. Override path with FILE."
    task :import => :environment do
      path = ENV['FILE'] || File.join(Rails.root, 'tmp', 'sphinx-stop-words.txt')
      
      puts "Importing auto-complete words from \"#{path}\"..."
      count = SearchSuggestion.from_stop_words_file!(path)
      puts "Imported #{count} auto-complete words."
    end
    
    desc "Generate stop words file from contribution index. Set word count with COUNT. Override output path with FILE."
    task :generate => :environment do
      config = ThinkingSphinx::Configuration.instance
      
      output_file = ENV['FILE'] || File.join(Rails.root, 'tmp', 'sphinx-stop-words.txt')
      num_words = ENV['COUNT'] || SearchSuggestion.max_stops
      
      output = `#{config.bin_path}#{config.indexer_binary_name} --config "#{config.config_file}" --buildstops #{output_file} #{num_words} --buildfreqs contribution_core`
      
      puts "#{num_words} (max) stop words written to \"#{output_file}\"."
    end
  end
end
