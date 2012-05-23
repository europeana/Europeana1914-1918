namespace :assets do
  desc "Clear assets (CSS and JS) cache."
  task :expire => :environment do
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
