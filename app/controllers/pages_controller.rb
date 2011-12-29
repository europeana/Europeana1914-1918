class PagesController < ApplicationController
  def show
    if params[:locale].nil?
      redirect_to home_path
      return
    end
  
    path = File.join(params[:path] || 'index')
    if path.match(/^(.*)\.html$/)
      path = $1
    end
    
    tpaths = [ "/pages/#{path}", "/pages/#{path}/index" ]
    
    logger.debug("Template paths: #{tpaths.inspect}")
    if template_exists?(tpaths.first)
      render :template => tpaths.first
    elsif path.present? && template_exists?(tpaths.last)
      render :template => tpaths.last
    else
      raise ActionController::RoutingError, "No resource found for request path \"#{request.request_uri}\"."
    end
  end
end
