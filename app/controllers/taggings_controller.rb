##
# Handles ActsAsTaggableOn taggings
#
class TaggingsController < ApplicationController
  before_filter :find_tagging
  
  def edit
    current_user.may_edit_tagging!(@tagging)
  end
  
  def update
    current_user.may_edit_tagging!(@tagging)
    
    @tagging.tag = ActsAsTaggableOn::Tag.find_or_create_by_name(params[:tag][:name])
    tag_changed = @tagging.tag_id_changed?
    
    if @tagging.save
      @tagging.change_status_to(:revised, current_user.id) if tag_changed
      flash[:notice] = t('flash.actions.update.notice', :resource_name => t('activerecord.models.tagging'))
      redirect_to tagging_path
    else
      flash.now[:alert] = t('flash.actions.update.alert', :resource_name => t('activerecord.models.tagging'))
      render :action => :edit
    end
  end
  
#  def delete
#    current_user.may_delete_tagging!(@tagging)
#  end
#  
#  def destroy
#    current_user.may_delete_tagging!(@tagging)
#  end
  
protected
  
  def find_tagging
    @tagging = ActsAsTaggableOn::Tagging.find(params[:id])
  end
  
end
