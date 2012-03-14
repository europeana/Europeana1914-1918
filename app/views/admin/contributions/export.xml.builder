xml.instruct!
xml.collection do

  with_exported_contributions do |c|
    
    xml.record do
    
      xml.storyid c.id
      xml.title c.title
      xml.contributor c.contributor.contact.full_name
      xml.storyurl contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu', :port => 80)
      xml.created_at c.created_at
      @metadata_fields.each do |mf|
        [ c.metadata.fields[mf] ].flatten.each do |mfv|
          xml.tag! mf, (mfv || '')
        end
      end
      
    end
    
    xml.record do
      
      c.attachments.each do |a|
        
        xml.storyid c.id
        xml.itemid a.id
        xml.title a.title
        xml.storyurl contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu', :port => 80)
        xml.itemurl download_contribution_attachment_url(:id => a.id, :contribution_id => c.id, :extension => File.extname(a.file_file_name)[1..-1], :locale => nil, :host => 'www.europeana1914-1918.eu', :port => 80)
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
