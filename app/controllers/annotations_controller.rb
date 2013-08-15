##
# Handle storage and retrieval of Annotorious annotations
#
class AnnotationsController < ApplicationController

  # GET /:locale/annotations(.:format)
  def index
    attachment_id = params[:attachment_id] || attachment_id_from_src(params[:src])
    raise RunCoCo::BadRequest "attachment_id or src parameter required" unless attachment_id.present?
    
    attachment = Attachment.find(attachment_id, :include => { :annotations => :shapes })
    @annotations = attachment.annotations
    
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
          annotation_shape.geometry = {}
          shape_params[:geometry].each_pair do |key, value|
            annotation_shape.geometry[key] = value.to_f
          end
          annotation_shape.units = shape_params[:units] || "relative"
          annotation_shape.shape_type = shape_params[:type]
          @annotation.shapes << annotation_shape
        end
      end
      
      @annotation.save!
    end
    
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
  
  # PUT /:locale/annotations/:id(.:format)
  def update
    @annotation = Annotation.find(params[:id])
    current_user.may_edit_attachment_annotation!(@annotation)
    
    Annotation.transaction do
      @annotation.text = params[:annotation][:text]
      @annotation.save!
      
      @annotation.shapes = []
      params[:annotation][:shapes].each_value do |shape_params|
        AnnotationShape.new do |annotation_shape|
          annotation_shape.geometry = {}
          shape_params[:geometry].each_pair do |key, value|
            annotation_shape.geometry[key] = value.to_f
          end
          annotation_shape.units = shape_params[:units] || "relative"
          annotation_shape.shape_type = shape_params[:type]
          @annotation.shapes << annotation_shape
        end
      end
      
      @annotation.save!
    end
  
    respond_to do |format|
      format.json do
        render :json => {
          "success" => true,
          "id" => @annotation.id
        }
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
  
  # DELETE /:locale/annotations/:id(.:format)
  def destroy
    @annotation = Annotation.find(params[:id])
    current_user.may_delete_attachment_annotation!(@annotation)
    
    Annotation.transaction do
      @annotation.destroy
    end
    
    respond_to do |format|
      format.json do
        render :json => {
          "success" => true
        }
      end
    end
  end
  
protected

  def attachment_id_from_src(src)
    src.match(/\/attachments\/(\d+)\//)[1]
  end

end
