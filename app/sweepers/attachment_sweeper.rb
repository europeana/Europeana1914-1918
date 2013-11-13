class AttachmentSweeper < ActionController::Caching::Sweeper
  observe Attachment
  
  def after_create(attachment)
    expire_cache_for_contribution(attachment.contribution)
  end
  
  def after_update(attachment)
    expire_cache_for(attachment)
    expire_cache_for_contribution(attachment.contribution)
  end
  
  def after_destroy(attachment)
    expire_cache_for_contribution(attachment.contribution)
  end
  
private
  
  def expire_cache_for(attachment)
    fragments = []
    
    [ "nt", "xml" ].each do |format|
      fragments.push("attachments/#{format}/#{attachment.id}.#{format}")
    end
    
    fragments.each do |key|
      expire_fragment(key)
    end
  end
  
  # Some cached contribution fragments include attachment data
  def expire_cache_for_contribution(contribution)
    fragments = []
    
    [ "json", "nt", "xml" ].each do |format|
      fragments.push("contributions/#{format}/#{contribution.id}.#{format}")
    end
    
    fragments.each do |key|
      expire_fragment(key)
    end
  end
end
