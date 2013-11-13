class UserSweeper < ActionController::Caching::Sweeper
  observe User
  
  def after_destroy(user)
    user.contributions.find_each do |contribution|
      expire_cache_for_contribution(contribution)
    end
  end
  
private
  
  # Some cached contribution fragments include contributor data
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
