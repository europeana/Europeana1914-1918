##
# Interface to Trove API.
#
# @see http://trove.nla.gov.au/general/api-technical
#
class TroveController < ApplicationController
  before_filter :trove_api_configured?

  # GET /europeana/search
  def search
    @results = []
    
    render :template => 'search/page'
  end
  
protected
  
  def trove_api_configured?
    raise RuntimeError, "Trove API not configured." unless defined?(TROVE_API_KEY) == "constant" && TROVE_API_KEY.present?
  end

end

