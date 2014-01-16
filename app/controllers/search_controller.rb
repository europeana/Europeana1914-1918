class SearchController < ApplicationController
  before_filter :redirect_to_search, :only => [ :search, :explore ]

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
