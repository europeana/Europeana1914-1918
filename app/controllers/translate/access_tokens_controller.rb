class Translate::AccessTokensController < ApplicationController
  def create
    raise ActionController::InvalidAuthenticityToken unless verified_request?
    token = RunCoCo::BingTranslator.get_access_token
    
    respond_to do |format|
      format.json do
        render :json => token
      end
    end
  end
end
