namespace :assets do
  desc "Preload JS & CSS assets."
  task :preload => :environment do
    base_url = URI.parse(RunCoCo.configuration.site_url)
    base_url.hostname = 'localhost'
    
    [ 
      "/en", "/en/explore", "/en/users/register", "/en/contributions/search",
      "/en/collection-days",
      "/en/contributions/" + Contribution.published.first.id.to_s 
    ].each do |page_path|
      page_url = base_url.dup
      page_url.path = page_path
      puts "Requesting #{page_url.to_s}"
      Net::HTTP.get(page_url)
    end
  end
  
  # Backwards compability
  task :expire => :environment do
    Rake::Task["cache:assets:clear"].invoke
  end
end
