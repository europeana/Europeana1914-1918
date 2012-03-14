xml.instruct!
xml.collection do

  with_exported_contributions do |c|
    
    xml.record do
      
      xml.record_type 'story'
      xml.story_id c.id
      xml.title c.title
      xml.contributor c.contributor.contact.full_name
      xml.story_url contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu', :port => 80)
      xml.created_at c.created_at
      @metadata_fields.each do |mf|
        [ c.metadata.fields[mf] ].flatten.each do |mfv|
          xml.tag! mf, (mfv || '')
        end
      end
      
    end
    
    c.attachments.each do |a|
      
      xml.record do
        
        xml.record_type 'item'
        xml.story_id c.id
        xml.item_id a.id
        xml.title a.title
        xml.story_url contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu', :port => 80)
        xml.item_img download_contribution_attachment_url(:id => a.id, :contribution_id => c.id, :extension => File.extname(a.file_file_name)[1..-1], :locale => nil, :host => 'www.europeana1914-1918.eu', :port => 80)
        xml.item_url ''
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
