xml.instruct!
xml.collection do
  @contributions.each do |c|
    if c.attachments.size > 0
      c.attachments.each do |a|
        xml.contribution do
          xml.id c.id
          xml.title c.title
          xml.contributor c.contributor.contact.full_name
          xml.url download_contribution_attachment_url(a, c, File.extname(a.file_file_name)[1..-1], :locale => nil, :host => 'www.europeana1914-1918.eu', :port => 80)
          xml.created_at c.created_at
          @metadata_fields.each do |mf|
            [ c.metadata.fields[mf] ].flatten.each do |mfv|
              xml.send mf, mfv || ''
            end
          end
        end
      end
    else
      xml.contribution do
        xml.id c.id
        xml.title c.title
        xml.contributor c.contributor.contact.full_name
        xml.url contribution_url(c, :host => 'www.europeana1914-1918.eu', :port => 80)
        xml.created_at c.created_at
        @metadata_fields.each do |mf|
          [ c.metadata.fields[mf] ].flatten.each do |mfv|
            xml.send mf, mfv || ''
          end
        end
      end
    end
  end
end
