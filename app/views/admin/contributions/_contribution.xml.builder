    xml.contribution do
      xml.id c.id
      xml.title c.title
      xml.contributor c.contributor.contact.full_name
      if local_assigns[:a].nil?
        xml.url contribution_url(c, :host => 'www.europeana1914-1918.eu', :port => 80)
      else
        xml.url download_contribution_attachment_url(a, c, File.extname(a.file_file_name)[1..-1], :locale => nil, :host => 'www.europeana1914-1918.eu', :port => 80)
      end
      xml.created_at c.created_at
      @metadata_fields.each do |mf|
        [ c.metadata.fields[mf.name] ].flatten.each do |mfv|
          xml.send mf.name, mfv || ''
        end
      end
    end
