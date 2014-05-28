class Admin::TaggingsController < AdminController
  # GET /admin/taggings
  def index
    count = [ (params[:count] || 20).to_i, 100 ].min # Default 20, max 100
    page = (params[:page] || 1).to_i

    params[:col] = params[:col].to_s.downcase
    params[:col] = 'created_at' unless [ 'created_at', 'updated_at', 'text', 'tags.name' ].include?(params[:col])

    params[:order] = params[:order].to_s.upcase
    params[:order] = 'DESC' unless [ 'ASC', 'DESC' ].include?(params[:order])
    
    @taggings = ActsAsTaggableOn::Tagging.where(:context => 'tags').includes('tag').joins(:current_status).order("#{params[:col]} #{params[:order]}").paginate(:page => params[:page])
  end
end
