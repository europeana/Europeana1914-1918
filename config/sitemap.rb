# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = RunCoCo.configuration.site_url

SitemapGenerator::Sitemap.create do
  # The root path '/' and sitemap index file are added automatically for you.
  # Links are added to the Sitemap in the order they are specified.
  
  # Published contributions, and their image files
  Contribution.published.find_each do |contribution|
    attachments = contribution.attachments.includes(:metadata => :field_license_terms)
    
    images = attachments.select(&:image?).collect do |attachment|
      { 
        :loc => attachment.file.url(:original, :timestamp => false), 
        :title => attachment.title.blank? ? nil : attachment.title, 
        :caption => attachment.metadata.field_description.blank? ? nil : attachment.metadata.field_description, 
        :license => attachment.metadata.field_license_terms.collect(&:term).first,
        :geo_location => attachment.metadata.field_location_placename.blank? ? nil : attachment.metadata.field_location_placename
      }
    end
  
    I18n.available_locales.each do |locale|
      add contribution_path(:locale => locale, :id => contribution.id), :lastmod => contribution.updated_at, :images => images
    end
  end
end

