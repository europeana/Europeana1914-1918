namespace :assets do
  desc "Preload JS & CSS assets."
  task :preload => :environment do
    base_url = URI.parse(RunCoCo.configuration.site_url)
    http = Net::HTTP.new('localhost', base_url.port)
    http.read_timeout = 120
    
    pages = [ 
      "/en", "/en/explore", "/en/users/register", "/en/contributions/search",
      [ "/en/collection/search", "qf[]=index%3Aa" ],
      "/en/collection-days", "/en/europeana/record" + EuropeanaRecord.first.record_id
    ]
    
    [ "audio/%", "image%", "video/%" ].each do |content_type|
      if attachment = Attachment.published.where("file_content_type LIKE '#{content_type}'").first
        pages << "/en/contributions/" + attachment.contribution.id.to_s
      end
    end
    
    pages.each do |page|
      page_url = base_url.dup
      page_url.hostname = 'localhost'
      if page.is_a?(Array)
        page_url.path = page.first
        page_url.query = page.last
        get_path = [ page.first, page.last ].join(',')
      else
        page_url.path = page
        get_path = page
      end
      puts "Requesting #{page_url.to_s}"
      http.get(get_path)
    end
  end
  
  # Backwards compability
  task :expire => :environment do
    Rake::Task["cache:assets:clear"].invoke
  end
end
