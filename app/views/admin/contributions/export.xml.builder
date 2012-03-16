xml.instruct!
xml.collection do

  with_exported_contributions do |c|
    
    xml.record do
      
      xml.record_type 'story'
      xml.story_id c.id
      xml.title c.title
      
      # id_europeanaURI - used to create hashtag for europeana ingestion ( europeana:object )
      # this url will not work in a browser because there is no locale, but that's okay
      # e.g. http://www.europeana1914-1918.eu/contributions/1370
      xml.id_europeanaURI localeless_contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu')
      
      # this is the viewable url for the story, defaulting to the en locale ( europeana:isShownAt )
      # e.g. http://www.europeana1914-1918.eu/en/contributions/1370
      xml.story_url contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu')
      
      xml.contributor c.contributor.contact.full_name
      
      # story_img should be the cover image selected for the story.
      # if no cover image has been seleted then leave this node out
      # story_img should be the .full version so that the browser does not try to download the image but displays it
      xml.story_img ''
      
      xml.created_at c.created_at
      
      # these fields are in the @metadata_fields.each loop
      # file_type hard-coded to "TEXT" for all stories
      # license hard-coded to "http://creativecommons.org/publicdomain/zero/1.0/"
      @metadata_fields.each do |mf|
        if mf == 'file_type'
          xml.file_type 'TEXT'
        elsif mf == 'license'
          xml.license 'http://creativecommons.org/publicdomain/zero/1.0/'
        else
          [ c.metadata.fields[mf] ].flatten.each do |mfv|
            xml.tag! mf, (mfv || '')
          end
        end
      end
      
    end
    
    
    c.attachments.each do |a|
      
      xml.record do
        
        xml.record_type 'item'
        xml.story_id c.id
        xml.item_id a.id
        
        # needs to get the story's title if not present and be sequenced
        # e.g., my grand father's story, item 1, my grand father's story, item 2
        xml.title a.title
        
        # id_europeanaURI - used to create hashtag for europeana ingestion ( europeana:object )
        # does not include the locale
        # this url is not viewable, that's okay
        # e.g. http://www.europeana1914-1918.eu/attachments/12873/1370.12873.original.12873.JPG
        xml.id_europeanaURI download_contribution_attachment_url(:id => a.id, :contribution_id => c.id, :extension => a.id, :format => File.extname(a.file_file_name)[1..-1], :locale => nil, :host => 'www.europeana1914-1918.eu')
        
        # this is the viewable url for the story, defaulting to the en locale
        # ( europeana:isShownAt, dcTermsPartOf, relation )
        # e.g. http://www.europeana1914-1918.eu/en/contributions/1370
        xml.story_url contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu')
        
        # item_url should be viewable in the browser
        # using the .full version will take care of that
        # ( europeana:isShownBy, for the lightbox as well )
        # e.g. http://www.europeana1914-1918.eu/attachments/12873/1370.12873.full.JPG
        xml.item_url download_contribution_attachment_url(:id => a.id, :contribution_id => c.id, :extension => File.extname(a.file_file_name)[1..-1], :locale => nil, :host => 'www.europeana1914-1918.eu')
        
        # these fields are in the meta_fields.each loop
        # if no description is available it should be inherited from the story
        # if no keywords are available, they should be inherited by the story
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
