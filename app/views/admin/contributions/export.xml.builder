xml.instruct!
xml.collection do
  with_exported_contributions do |c|

    xml.contribution do
      xml.story do
        xml.id c.id
        xml.title c.title
        xml.contributor c.contributor.contact.full_name
        xml.url contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu', :port => 80)
        xml.created_at c.created_at
        @metadata_fields.each do |mf|
          [ c.metadata.fields[mf] ].flatten.each do |mfv|
            xml.tag! mf, (mfv || '')
          end
        end
      end
      
      xml.items do
        c.attachments.each do |a|
          xml.item do
            xml.id a.id
            xml.title a.title
            xml.url download_contribution_attachment_url(:id => a.id, :contribution_id => c.id, :extension => File.extname(a.file_file_name)[1..-1], :locale => nil, :host => 'www.europeana1914-1918.eu', :port => 80)
            xml.created_at a.created_at
            @metadata_fields.each do |mf|
              [ a.metadata.fields[mf] ].flatten.each do |mfv|
                xml.tag! mf, (mfv || '')
              end
            end
          end
        end
      end
      
    end
    
  end
end
