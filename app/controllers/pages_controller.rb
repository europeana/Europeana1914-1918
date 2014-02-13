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
    
    views_prefix = 'pages'
    
    if template_exists?(path, [ views_prefix ])
      render :template => "#{views_prefix}/#{path}"
    elsif path.present? && template_exists?("#{path}/index", [ views_prefix ])
      render :template => "#{views_prefix}/#{path}/index"
    else
      raise ActionController::RoutingError, "No resource found for request path \"#{request.fullpath}\"."
    end
  end
end
