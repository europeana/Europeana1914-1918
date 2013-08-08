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
    
    if params[:tags].present?
      current_user.tag(@contribution, :with => params[:tags], :on => :tags)

      if @contribution.respond_to?(:index!)
        # Force index because change of owned tags are not detected by
        # dirty record checks.
        @contribution.tags(:reload => true)
        @contribution.index!
      end
    end
    
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.tags.create.success')
        redirect_to contribution_path(@contribution)
      end
      format.json do
        render :json => {
          "success" => true,
          "message" => t('flash.tags.create.success'),
          "tags" => {
            "all" => @contribution.tags.collect(&:name).uniq,
            "user" => @contribution.owner_tags_on(current_user, :tags).collect(&:name).uniq
          }
        }
      end
    end
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
