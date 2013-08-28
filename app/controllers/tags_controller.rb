##
# Handles ActsAsTaggableOn tagging of contributions
#
class TagsController < ApplicationController
  before_filter :find_contribution
  before_filter :find_tag, :except => [ :index, :create ]

  # GET /:locale/contributions/:contribution_id/tags(.:format)
  def index
    respond_to do |format|
      format.json do 
        render :json => { 
          "tags" => @contribution.tags.collect(&:name),
          "contrib_path" => contribution_path(@contribution),
          "tConfirm" => t('actions.delete'),
          "tDelete" => t('views.tags.delete.question')
        }
      end
    end
  end

  # POST /:locale/contributions/:contribution_id/tags(.:format)
  def create
    current_user.may_tag_contribution!(@contribution)
    
    if params[:tags].present?
      new_tags = params[:tags].split(",").collect(&:strip) - @contribution.tags.collect(&:name)
      user_tags = @contribution.owner_tags_on(current_user, :tags).collect(&:name)
      current_user.tag(@contribution, :with => user_tags + new_tags, :on => :tags)
      
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
          "tags" => @contribution.tags.collect(&:name)
        }
      end
    end
  end
  
  # GET /:locale/contributions/:contribution_id/tags/:id/flag(.:format)
  def confirm_flag
    current_user.may_flag_contribution_tag!(@tag)
  end
  
  # PUT /:locale/contributions/:contribution_id/tags/:id/flag(.:format)
  def flag
    current_user.may_flag_contribution_tag!(@tag)
    
    @tag.taggings.each do |tagging|
      current_user.tag(tagging, :with => "inappropriate", :on => :flags)
      
      if tagging.flags(:reload => true).size >= 3
        tagging.destroy
      end
    end
    
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.tags.flag.success')
        redirect_to contribution_path(@contribution)
      end
      format.json do
        render :json => {
          "success" => true,
          "message" => t('flash.tags.flag.success')
        }
      end
    end
  end
  
  # GET /:locale/contributions/:contribution_id/tags/:id/:delete(.:format)
  def delete
    current_user.may_untag_contribution!(@tag)
  end
  
  # DELETE /:locale/contributions/:contribution_id/tags/:id(.:format)
  def destroy
    current_user.may_untag_contribution!(@tag)
    
    @tag.taggings.each(&:destroy)
    @contribution.tags(:reload => true)
    
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.tags.destroy.success')
        redirect_to contribution_path(@contribution)
      end
      format.json do
        render :json => {
          "success" => true,
          "message" => t('flash.tags.destroy.success'),
          "tags" => @contribution.tags.collect(&:name)
        }
      end
    end
  end
  
protected

  def find_contribution
    @contribution = Contribution.find(params[:contribution_id], :include => :tags)
  end
  
  def find_tag
    @tag = ActsAsTaggableOn::Tag.find_by_name!(params[:id])
  end

end
