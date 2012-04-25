class BlogPostsController < ApplicationController
  ##
  # GET /blog/:blog(/:category)
  #
  def show
    option_keys = [ :blog, :category, :deblogger, :limit, :locale, :offset, :read_more, :relocale, :tag, :titles ]
    @options = {}
    option_keys.each do |key|
      if params.has_key?(key)
        @options[key] = params[key]
      end
    end
    render :partial => 'list', :locals => @options
  end
end
