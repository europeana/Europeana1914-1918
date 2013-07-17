# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "http://www.example.com"

SitemapGenerator::Sitemap.create do
  # Put links creation logic here.
  #
  # The root path '/' and sitemap index file are added automatically for you.
  # Links are added to the Sitemap in the order they are specified.
  
  # Published contributions, their attachments, and their image files
  Contribution.published.find_each do |contribution|
    I18n.available_locales.each do |locale|
      add contribution_path(:locale => locale, :id => contribution.id), :lastmod => contribution.updated_at
    end
    
    contribution.attachments.includes(:metadata => :field_license_terms).each do |attachment|
      images = []
      if attachment.image?
        images = [ { 
          :loc => attachment.file.url(:original, :timestamp => false), 
          :title => attachment.title, 
          :caption => attachment.metadata.field_description, 
          :license => attachment.metadata.field_license_terms.collect(&:term).first,
          :geo_location => attachment.metadata.field_location_placename
        } ]
      end
      I18n.available_locales.each do |locale|
        add contribution_attachment_path(:locale => locale, :contribution_id => contribution.id, :id => attachment.id), :lastmod => attachment.updated_at, :images => images
      end
    end
  end
end

