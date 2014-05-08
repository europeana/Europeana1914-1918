##
# Handles ActsAsTaggableOn tagging of ActiveRecord objects
#
class TagsController < ApplicationController
  before_filter :find_taggable
  before_filter :find_tag, :except => [ :index, :create ]

  def index
    respond_to do |format|
      format.json do 
        tags = @taggable.visible_tags.collect(&:name)
        render :json => { 
          "tags" => tags,
          "contrib_path" => taggable_path(@taggable),
          "tConfirm" => t('actions.delete'),
          "tDelete" => t('views.tags.delete.question')
        }
      end
    end
  end

  def create
    current_user.may_tag_object!(@taggable)
    
    if params[:tags].present?
      new_tags = params[:tags].split(",").collect(&:strip) - @taggable.tags.collect(&:name)
      user_tags = @taggable.owner_tags_on(current_user, :tags).collect(&:name)
      current_user.tag(@taggable, :with => user_tags + new_tags, :on => :tags)
      
      @taggable.taggings.each do |tagging|
        if tagging.context == 'tags'
          if tagging.current_status.nil?
            tagging.change_status_to(:published, current_user.id)
          end
        end
      end
      
      if @taggable.respond_to?(:index!)
        # Force index because change of owned tags are not detected by
        # dirty record checks.
        @taggable.tags(:reload => true)
        @taggable.index!
      end
    end
    
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.tags.create.success')
        redirect_to taggable_path(@taggable)
      end
      format.json do
        render :json => {
          "success" => true,
          "message" => t('flash.tags.create.success'),
          "tags" => @taggable.visible_tags.collect(&:name)
        }
      end
    end
  end
  
  def flag
    current_user.may_flag_object_tag!(@taggable, @tag)
  end
  
  def confirm_flag
    current_user.may_flag_object_tag!(@taggable, @tag)
    
    @taggable.taggings.select { |tagging| tagging.tag == @tag }.each do |tagging|
      current_user.tag(tagging, :with => "inappropriate", :on => :flags)
      tagging.change_status_to(:flagged, current_user.id)
      
      if tagging.flags(:reload => true).size >= 3
        tagging.change_status_to(:depublished, current_user.id)
      end
    end
    
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.tags.flag.success')
        redirect_to taggable_path(@taggable)
      end
      format.json do
        render :json => {
          "success" => true,
          "message" => t('flash.tags.flag.success')
        }
      end
    end
  end
  
  def delete
    current_user.may_untag_object!(@taggable, @tag)
  end
  
  def destroy
    current_user.may_untag_object!(@taggable, @tag)
    
    @taggable.taggings.select { |tagging| tagging.tag == @tag }.each { |tagging| tagging.destroy }
    @taggable.tags(:reload => true)
    
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.tags.destroy.success')
        redirect_to taggable_path(@taggable)
      end
      format.json do
        render :json => {
          "success" => true,
          "message" => t('flash.tags.destroy.success'),
          "tags" => @taggable.tags.collect(&:name)
        }
      end
    end
  end
  
protected

  def find_tag
    @tag = ActsAsTaggableOn::Tag.find_by_id!(params[:id])
  end

end
