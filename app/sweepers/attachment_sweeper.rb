class AttachmentSweeper < ActionController::Caching::Sweeper
  observe Attachment
  
  def after_update(attachment)
    expire_cache_for(attachment)
  end
  
  def expire_cache_for(attachment)
    fragments = []
    
    I18n.available_locales.each do |locale|
      [ "nt", "xml" ].each do |format|
        fragments.push("attachments/#{format}/#{attachment.id}.#{format}")
      end
    end
    
    fragments.each do |key|
      expire_fragment(key)
    end
  end
end
