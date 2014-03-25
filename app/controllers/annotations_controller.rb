##
# Handle storage and retrieval of Annotorious annotations
#
class AnnotationsController < ApplicationController
  before_filter :find_annotation, :except => [ :index, :create ]

  # GET /:locale/annotations(.:format)
  def index
    attachment_id = params[:attachment_id] || attachment_id_from_src(params[:src])
    raise RunCoCo::BadRequest "attachment_id or src parameter required" unless attachment_id.present?
    
    attachment = Attachment.find(attachment_id)
    @annotations = attachment.visible_annotations.includes(:shapes)
    
    respond_to do |format|
      format.json do
        render :json => {
          "annotations" => @annotations.collect { |a| a.to_hash.merge(:editable => current_user.may_edit_attachment_annotation?(a)) },
          "creatable" => current_user.may_create_attachment_annotation?(attachment)
        }
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
    current_user.may_flag_annotation!(@annotation)
  end
  
  # PUT /:locale/annotations/:id/flag(.:format)
  def confirm_flag
    current_user.may_flag_annotation!(@annotation)
    
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
          "message" => t('flash.annotations.flag.alert')
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
    src.match(/\/attachments\/(\d+)\//)[1]
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
