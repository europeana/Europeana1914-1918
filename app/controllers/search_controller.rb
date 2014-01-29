class SearchController < ApplicationController
  before_filter :redirect_to_search, :only => [ :search, :explore ]
  
  # Retry connections to search engine in case of temporary unavailability
  around_filter do |controller, proxy|
    tries = 3
    begin
      proxy.call
    rescue Errno::ECONNREFUSED
      tries -= 1
      if tries == 0
        logger.warn("Connection to #{controller.controller_name} search engine refused; aborting")
        raise RunCoCo::SearchOffline
      else
        logger.warn("Connection to #{controller.controller_name} search engine refused; retrying")
        sleep 5
        retry
      end
    end
  end

protected
  
  ##
  # Handles redirects to sanitize parameters.
  #
  # Sub-classes should:
  # * override this method
  # * alter the +params+ Hash as necessary
  # * perform their own tests for required redirects
  # * set +@redirect_required+ to +true+ if a redirect is required
  # * call +super+
  #
  def redirect_to_search
    if params[:provider] && params[:provider] != self.controller_name
      params.delete(:qf)
      params[:controller] = params[:provider]
      @redirect_required = true
    end
    
    params.delete(:provider)
    
    redirect_to params if @redirect_required
  end

end
