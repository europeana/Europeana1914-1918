xml.instruct!
xml.collection do

  with_exported_contributions do |c|
    
    xml.record do
      
      xml.record_type 'story'
      xml.story_id c.id
      xml.title c.title
      xml.contributor c.contributor.contact.full_name
      xml.record_url contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu', :port => 80)
      
      # img_url should be the .full version so that the browser does not try to download the image
      # img_url should be the cover image item selected for the story
      # check with david on what to do when no cover image has been selected
        xml.story_img ''
      
      # file_type should be TEXT, not IMAGE for all stories
      # file_type is part of the meta_fields.each loop
      
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
        
        # needs to get the story's title if not present and be sequenced
          xml.title a.title
        
        # record_url should go to the item show page with metadata
        # e.g., http://www.europeana1914-1918.eu/en/contributions/1700/attachments/30881/
          xml.record_url ''
          
        # this is here as a reference for the item to its parent story
          xml.parent_url contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu', :port => 80)
        
        # item_img url should be the .full version so that the browser does not try to download the image
        # e.g., http://www.europeana1914-1918.eu/attachments/30881/1700.30881.full.jpg
          xml.item_img download_contribution_attachment_url(:id => a.id, :contribution_id => c.id, :extension => File.extname(a.file_file_name)[1..-1], :locale => nil, :host => 'www.europeana1914-1918.eu', :port => 80)
        
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
