##
# Handles ActsAsTaggableOn tagging of contributions
#
class TagsController < ApplicationController
  before_filter :find_contribution

  # GET /:locale/contributions/:contribution_id/tags(.:format)
  def index
    respond_to do |format|
      format.json { render :json => @contribution.tags.collect(&:name) }
    end
  end
  
  # GET /:locale/contributions/:contribution_id/tags/new(.:format)
  def new
    current_user.may_tag_contribution!(@contribution)
  end

  # POST /:locale/contributions/:contribution_id/tags(.:format)
  def create
    current_user.may_tag_contribution!(@contribution)
    
    if params[:contribution][:tags].present?
      user_tags = @contribution.owner_tags_on(current_user, :tags)
      user_tags << params[:contribution][:tags]
      current_user.tag(@contribution, :with => user_tags, :on => :tags)
    end
    
    redirect_to contribution_path(@contribution)
  end
  
  # GET /:locale/contributions/:contribution_id/tags/:id/edit(.:format)
  # @todo Is editing a tag meaningful?
  def edit; end
  
  # GET /:locale/contributions/:contribution_id/tags/:id(.:format)
  # @todo Is showing a single tag useful?
  def show; end
  
  # PUT /:locale/contributions/:contribution_id/tags/:id(.:format)
  # @todo Is updating a tag meaningful?
  def update; end
  
  # DELETE /:locale/contributions/:contribution_id/tags/:id(.:format)
  # @note This should destroy the current user's *tagging*, not a tag
  def destroy; end
  
protected

  def find_contribution
    @contribution = Contribution.find(params[:contribution_id], :include => :tags)
  end

end
