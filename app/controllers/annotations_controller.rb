##
# Handle storage and retrieval of Annotorious annotations
#
class AnnotationsController < ApplicationController
  before_filter :find_annotation, :except => [ :index, :create ]

  # GET /:locale/annotations(.:format)
  def index
    respond_to do |format|
      format.json do
        error = nil
        
        attachment_id = params[:attachment_id] || attachment_id_from_src(params[:src])

        if attachment_id.present?
          if attachment = Attachment.find(attachment_id)
            annotations = attachment.visible_annotations.includes(:shapes)
          else
            error = "Invalid attachment ID in request."
          end
        else
          error = "No attachment ID in request."
        end
        
        if error.nil?
          render :json => {
            "success" => true,
            "annotations" => annotations.collect { |annotation|
              annotation.to_hash.merge({
                :editable => current_user.may_edit_attachment_annotation?(annotation),
                :flaggable => current_user.may_flag_attachment_annotation?(annotation),
                :flagged => annotation.flagged_by?(current_user)
              })
            },
            "creatable" => current_user.may_create_attachment_annotation?(attachment)
          }
        else
          render :json => {
            "success" => false,
            "error" => error,
            "annotations" => [],
            "creatable" => false
          }, :status => :bad_request
        end
      end
    end
  end
  
  # POST /:locale/annotations(.:format)
  def create
    attachment_id = attachment_id_from_src(params[:annotation][:src])
    attachment = Attachment.find(attachment_id)
    current_user.may_create_attachment_annotation!(attachment)
    
    Annotation.transaction do
      @annotation = Annotation.new
      @annotation.user_id = current_user.id
      @annotation.attachment_id = attachment_id
      @annotation.text = params[:annotation][:text]
      @annotation.save!
      
      params[:annotation][:shapes].each_value do |shape_params|
        AnnotationShape.new do |annotation_shape|
          annotation_shape.geometry = shape_params[:geometry]
          annotation_shape.units = shape_params[:units] || "relative"
          annotation_shape.shape_type = shape_params[:type]
          @annotation.shapes << annotation_shape
        end
      end
      
      @annotation.save!
      @annotation.change_status_to(:published, current_user.id)
    end
    
    index_contribution
    
    respond_to do |format|
      format.json do
        render :json => {
          "success" => true,
          "id" => @annotation.id
        }, :status => :created
      end
    end
    
  rescue ActiveRecord::RecordInvalid
    respond_to do |format|
      format.json do
        render :json => {
          "success" => false,
          "error" => @annotation.errors.full_messages
        }, :status => :bad_request
      end
    end
  end
  
  # GET /:locale/annotations/:id(.:format)
  def show
    respond_to do |format|
      format.json { render :json => @annotation.to_hash }
      format.nt { render :text => @annotation.to_ntriples }
    end
  end
  
  # GET /:locale/annotations/:id/edit(.:format)
  def edit
    current_user.may_edit_attachment_annotation!(@annotation)
  end
  
  # PUT /:locale/annotations/:id(.:format)
  def update
    current_user.may_edit_attachment_annotation!(@annotation)
    
    Annotation.transaction do
      @annotation.text = params[:annotation][:text]
      @annotation.save!
      
      if params[:annotation][:shapes]
        @annotation.shapes = []
        params[:annotation][:shapes].each_value do |shape_params|
          AnnotationShape.new do |annotation_shape|
            annotation_shape.geometry = shape_params[:geometry]
            annotation_shape.units = shape_params[:units] || "relative"
            annotation_shape.shape_type = shape_params[:type]
            @annotation.shapes << annotation_shape
          end
        end
      end
      
      @annotation.save!
    end
    
    index_contribution
  
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.actions.update.notice', :resource_name => t('activerecord.models.annotation'))
        redirect_to annotations_path
      end
      format.json do
        render :json => {
          "success" => true,
          "id" => @annotation.id
        }
      end
    end
    
  rescue ActiveRecord::RecordInvalid
    respond_to do |format|
      format.html do
        flash.now[:alert] = t('flash.actions.update.alert', :resource_name => t('activerecord.models.annotation'))
        render :action => :edit
      end
      format.json do
        render :json => {
          "success" => false,
          "error" => @annotation.errors.full_messages
        }, :status => :bad_request
      end
    end
  end
  
  # DELETE /:locale/annotations/:id(.:format)
  def destroy
    current_user.may_delete_attachment_annotation!(@annotation)
    
    Annotation.transaction do
      @annotation.destroy
    end
    
    index_contribution
    
    respond_to do |format|
      format.json do
        render :json => {
          "success" => true
        }
      end
    end
  end
  
  # GET /:locale/annotations/:id/flag(.:format)
  def flag
    current_user.may_flag_attachment_annotation!(@annotation)
  end
  
  # PUT /:locale/annotations/:id/flag(.:format)
  def confirm_flag
    current_user.may_flag_attachment_annotation!(@annotation)
    
    current_user.tag(@annotation, :with => "inappropriate", :on => :flags)
    @annotation.change_status_to(:flagged, current_user.id)
    
    if @annotation.flags(:reload => true).size >= 3
      @annotation.change_status_to(:depublished, current_user.id)
    end
    
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.annotations.flag.notice')
        redirect_to contribution_attachment_path(@annotation.attachment.contribution, @annotation.attachment)
      end
      format.json do
        render :json => {
          "success" => true,
          "message" => t('flash.annotations.flag.notice')
        }
      end
    end
  
  rescue
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.annotations.flag.alert')
        render :action => :flag
      end
      format.json do
        render :json => {
          "success" => false,
          "message" => t('flash.annotations.flag.alert')
        }
      end
    end
  end
  
  # GET /:locale/annotations/:id/unflag(.:format)
  def unflag
    current_user.may_flag_attachment_annotation!(@annotation)
  end
  
  # PUT /:locale/annotations/:id/unflag(.:format)
  def confirm_unflag
    current_user.may_flag_attachment_annotation!(@annotation)
    
    @annotation.owner_tags_on(current_user, :flags).find { |f| f.name == "inappropriate" }.destroy
    
    case @annotation.flags(:reload => true).size
    when 0
      @annotation.change_status_to(:published, current_user.id)
    when 1, 2
      @annotation.change_status_to(:flagged, current_user.id)
    end
    
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.annotations.unflag.notice')
        redirect_to contribution_attachment_path(@annotation.attachment.contribution, @annotation.attachment)
      end
      format.json do
        render :json => {
          "success" => true,
          "message" => t('flash.annotations.unflag.notice')
        }
      end
    end
    
  rescue
    respond_to do |format|
      format.html do
        flash[:notice] = t('flash.annotations.unflag.alert')
        render :action => :unflag
      end
      format.json do
        render :json => {
          "success" => false,
          "message" => t('flash.annotations.unflag.alert')
        }
      end
    end
  end
  
  # GET /:locale/annotations/:id/depublish(.:format)
  def depublish
    current_user.may_depublish_annotation!(@annotation)
  end
  
  # PUT /:locale/annotations/:id/depublish(.:format)
  def confirm_depublish
    current_user.may_depublish_annotation!(@annotation)
    
    if @annotation.change_status_to(:depublished, current_user.id)
      index_contribution
      flash[:notice] = t('flash.annotations.depublish.notice')
      redirect_to contribution_attachment_path(@annotation.attachment.contribution, @annotation.attachment)
    else
      flash.now[:alert] = t('flash.annotations.depublish.alert')
      render :action => :depublish
    end
  end
  
protected

  def attachment_id_from_src(src)
    if id_match = src.match(/\/attachments\/(\d+)\//)
      id_match[1]
    else
      nil
    end
  end

  def index_contribution
    if @annotation.attachment.contribution.respond_to?(:index!)
      @annotation.attachment.contribution.index!
    end
  end
  
  def find_annotation
    @annotation = Annotation.find(params[:id])
  end

end
