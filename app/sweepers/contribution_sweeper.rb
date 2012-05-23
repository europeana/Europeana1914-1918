class ContributionSweeper < ActionController::Caching::Sweeper
  observe Contribution
  
  def after_update(contribution)
    expire_cache_for(contribution)
  end
  
  def expire_cache_for(contribution)
    locale_subpattern = '(' + I18n.available_locales.join('|') + ')'
    
    fragments = [
      Regexp.new("v2/#{locale_subpattern}/contributions/search_result/#{contribution.id}"),
    ]
    
    fragments.each do |key|
      expire_fragment(key)
    end
  end
end
