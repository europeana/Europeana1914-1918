class ContributionSweeper < ActionController::Caching::Sweeper
  observe Contribution
  
  def after_update(contribution)
    expire_cache_for(contribution)
  end
  
  def expire_cache_for(contribution)
    fragments = []
    
    I18n.available_locales.each do |locale|
      fragments.push("v2/#{locale}/contributions/search_result/#{contribution.id}")
    end
    
    fragments.each do |key|
      expire_fragment(key)
    end
  end
end
