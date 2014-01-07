    xml.oai_europeana19141918 :record do
      
      xml.oai_europeana19141918 :record_type, 'story'
      xml.oai_europeana19141918 :story_id, c.id
      xml.oai_europeana19141918 :title, c.title
      
      # id_europeanaURI - used to create hashtag for europeana ingestion ( europeana:object )
      # this url will not work in a browser because there is no locale, but that's okay
      # e.g. http://www.europeana1914-1918.eu/contributions/1370
      xml.oai_europeana19141918 :id_europeanaURI, localeless_contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu')
      
      # this is the viewable url for the story, defaulting to the en locale ( europeana:isShownAt )
      # e.g. http://www.europeana1914-1918.eu/en/contributions/1370
      xml.oai_europeana19141918 :story_url, contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu')
      xml.oai_europeana19141918 :record_url, contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu')
      
      xml.oai_europeana19141918 :contributor, c.contributor.contact.full_name
      
      # story_img should be the cover image selected for the story.
      # if no cover image has been seleted then leave this node out
      # story_img should be the .full version so that the browser does not try to download the image but displays it
      xml.oai_europeana19141918 :story_img, ''
      
      xml.oai_europeana19141918 :created_at, c.created_at
      
      xml.oai_europeana19141918 :provider, "Europeana 1914 - 1918"
      xml.oai_europeana19141918 :data_provider, (c.contributor.institution.present? ? c.contributor.institution.name : '')
      
      # these fields are in the @metadata_fields.each loop
      # file_type hard-coded to "TEXT" for all stories
      # license hard-coded to "http://creativecommons.org/publicdomain/zero/1.0/"
      @metadata_fields.each do |mf|
        if mf == 'file_type'
          xml.oai_europeana19141918 :file_type, 'TEXT'
        elsif mf == 'license'
          xml.oai_europeana19141918 :license, 'http://creativecommons.org/publicdomain/zero/1.0/'
        else
          [ c.metadata.fields[mf] ].flatten.each do |mfv|
            xml.tag! 'oai_europeana19141918:' + mf, (mfv || '')
          end
        end
      end
      
    end
    
    item_pos = titleless_items = 0
    c.attachments.select { |a| a.file_file_name.present? }.each do |a|
      item_pos = item_pos + 1
      
      xml.oai_europeana19141918 :record do
        
        xml.oai_europeana19141918 :record_type, 'item'
        xml.oai_europeana19141918 :story_id, c.id
        xml.oai_europeana19141918 :item_id, a.id
        
        # needs to get the story's title if not present and be sequenced
        # e.g., my grand father's story, item 1, my grand father's story, item 2
        if a.title.present?
          xml.oai_europeana19141918 :title, a.title
        else
          titleless_items = titleless_items + 1
          # For sequential item counts when some have title and some don't,
          # change item_pos to titleless_items here.
          xml.oai_europeana19141918 :title, c.title + ', item ' + item_pos.to_s
        end
        
        # id_europeanaURI - used to create hashtag for europeana ingestion ( europeana:object )
        # does not include the locale
        # this url is not viewable, that's okay
        # e.g. http://www.europeana1914-1918.eu/attachments/12873/1370.12873.original.12873.JPG
        xml.oai_europeana19141918 :id_europeanaURI, download_contribution_attachment_url(:id => a.id, :contribution_id => c.id, :extension => a.id, :format => File.extname(a.file_file_name)[1..-1], :locale => nil, :host => 'www.europeana1914-1918.eu')
        
        # this is the viewable url for the story, defaulting to the en locale
        # ( europeana:isShownAt )
        # e.g. http://www.europeana1914-1918.eu/en/contributions/1370
        xml.oai_europeana19141918 :story_url, contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu')
        
        # this is the visible url for the story, defaulting to the en locale
        # ( dc:relation )
        xml.oai_europeana19141918 :relation_url, contribution_url(:id => c.id, :host => 'www.europeana1914-1918.eu')
        
        # record_url should be viewable in the browser
        # using the .full version will take care of that
        # ( europeana:isShownBy, for the lightbox as well )
        # e.g. http://www.europeana1914-1918.eu/attachments/12873/1370.12873.full.JPG
        xml.oai_europeana19141918 :record_url, inline_contribution_attachment_url(:id => a.id, :contribution_id => c.id, :style => 'full', :extension => File.extname(a.file_file_name)[1..-1], :locale => nil, :host => 'www.europeana1914-1918.eu')
        
        # contributor is set at the contribution/story level, so duplicate fomr
        # there
        xml.oai_europeana19141918 :contributor, c.contributor.contact.full_name
        
        xml.oai_europeana19141918 :created_at, a.created_at
        
        # these fields are in the @metadata_fields.each loop
        # if no description is available it should be inherited from the story
        if a.metadata.fields['attachment_description'].blank?
          a.metadata.fields['attachment_description'] = c.metadata.fields['description']
        end
        
        # if these fields are not available they should be inherited from the story
        # keywords, theatres or forces
        [ 'keywords', 'theatres', 'forces', 'creator' ].each do |field_name|
          if a.metadata.fields[field_name].blank?
            a.metadata.fields[field_name] = c.metadata.fields[field_name]
          end
        end
        
        @metadata_fields.each do |mf|
          [ a.metadata.fields[mf] ].flatten.each do |mfv|
            xml.tag! 'oai_europeana19141918:' + mf, (mfv || '')
          end
        end
        
      end
      
    end
