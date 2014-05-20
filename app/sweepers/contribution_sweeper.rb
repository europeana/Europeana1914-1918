class ContributionSweeper < ActionController::Caching::Sweeper
  observe Contribution
  
  def after_create(contribution)
#    precache_for(contribution)
  end
  
  def after_update(contribution)
    expire_cache_for(contribution)
#    precache_for(contribution)
  end
  
  def after_destroy(contribution)
    expire_cache_for(contribution)
  end
  
private
  
  def expire_cache_for(contribution)
    fragments = [
      "contributions/edm/result/#{contribution.id}"
    ]
    
    [ "json", "nt", "xml" ].each do |format|
      fragments.push("contributions/#{format}/#{contribution.id}.#{format}")
    end
      
    I18n.available_locales.each do |locale|
      [ "v2", "v2.1", "v3" ].each do |theme|
        fragments.push("#{theme}/#{locale}/contributions/search_result/#{contribution.id}")
        fragments.push("#{theme}/#{locale}/search/result/contributions/#{contribution.id}")
        fragments.push("#{theme}/#{locale}/search/result/collection/#{contribution.id}")
      end
    end
    
    fragments.each do |key|
      expire_fragment(key)
    end
  end
  
  def precache_for(contribution)
    ContributionsController.new.cached(contribution, :xml)
  end
end
