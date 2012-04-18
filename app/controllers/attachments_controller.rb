class AttachmentsController < ApplicationController
  before_filter :find_contribution
  before_filter :find_attachment, :except => [ :index, :new, :create ]

  # GET /contributions/:contribution_id/attachments
  def index
    current_user.may_view_contribution_attachments!(@contribution)
    @attachments = @contribution.attachments
    respond_to do |format|
      format.html
      format.json do
        render :json => @attachments.paginate(:page => params[:page], :per_page => params[:count])
      end
    end
  end

  # GET /contributions/:contribution_id/attachments/new
  def new
    current_user.may_create_contribution_attachment!(@contribution)
    @attachment = Attachment.new
    @attachment.contribution = @contribution
    @attachment.build_metadata
    
    text = MetadataField.find_by_name('file_type').taxonomy_terms.select { |tt| tt.term == 'TEXT' }.first
    @attachment.metadata.field_file_type_term_ids = [ text.id ]
    license = MetadataField.find_by_name('license').taxonomy_terms.select { |tt| tt.term == 'http://creativecommons.org/licenses/by-sa/3.0/' }.first
    @attachment.metadata.field_license_term_ids = [ license.id ]
  end

  # POST /contributions/:contribution_id/attachments 
  def create
    current_user.may_create_contribution_attachment!(@contribution)
    
    @attachment = Attachment.new
    @attachment.build_metadata
    
    if params[:uploadify]
      attachment_attributes = (params[:attachment].is_a?(String) ? JSON.parse(params[:attachment]) : params[:attachment])
      attachment_attributes[:file] = params[:attachment_file]
      attachment_attributes[:file].content_type = MIME::Types.type_for(attachment_attributes[:file].original_filename).first
    else
      attachment_attributes = params[:attachment]
    end
    
    @attachment.attributes = attachment_attributes
    @attachment.metadata.cataloguing = true if current_user.may_catalogue_contribution?(@attachment.contribution)
    @attachment.contribution = @contribution
    
    unless attachment_attributes.is_a?(Hash) && attachment_attributes.has_key?(:metadata_attributes) && attachment_attributes[:metadata_attributes].has_key?(:field_license_term_ids)
      license = MetadataField.find_by_name('license').taxonomy_terms.select { |tt| tt.term == 'http://creativecommons.org/licenses/by-sa/3.0/' }.first
      @attachment.metadata.field_license_term_ids = [ license.id ]
    end
    
    unless attachment_attributes.is_a?(Hash) && attachment_attributes.has_key?(:metadata_attributes) && attachment_attributes[:metadata_attributes].has_key?(:field_file_type_term_ids)
      text = MetadataField.find_by_name('file_type').taxonomy_terms.select { |tt| tt.term == 'TEXT' }.first
      @attachment.metadata.field_file_type_term_ids = [ text.id ]
    end
    
    if @attachment.save
      respond_to do |format| 
        format.html do
          flash[:notice] = t('flash.attachments.create.notice') + ' ' + t('flash.attachments.links.view-attachments_html')
          if @contribution.submitted?
            redirect_to @attachment.contribution
          else
            redirect_to new_contribution_attachment_path(@contribution)
          end
        end
        format.json  { render :json => { :result => 'success', :url => contribution_attachment_path(@contribution, @attachment) } } 
      end 
    else
      respond_to do |format| 
        format.html do
          flash.now[:alert] = t('flash.attachments.create.alert')
          render :action => 'new', :status => :bad_request
        end
        format.json  { render :json => { :result => 'error', :msg => @attachment.errors.values.flatten.to_sentence }, :status => :bad_request } 
      end
    end
  end

  # GET /contributions/:contribution_id/attachments/:id
  def show
    current_user.may_view_attachment!(@attachment)
    respond_to do |format|
      format.html
      format.json do
        render :json => @attachment
      end
    end
  end

  # GET /contributions/:contribution_id/attachments/:id/:style/:filename
  def inline
    current_user.may_view_attachment!(@attachment)
    style = (params[:style] == 'full' ? 'original' : params[:style])
    send_file @attachment.file.path(style), :type => @attachment.file.content_type, :disposition => 'inline'
  end

  # GET /contributions/:contribution_id/attachments/:id/:filename
  def download
    current_user.may_view_attachment!(@attachment)
    send_file @attachment.file.path, :type => @attachment.file.content_type
  end

  # GET /contributions/:contribution_id/attachments/:id/edit
  def edit
    current_user.may_edit_attachment!(@attachment)
    @attachment.build_metadata unless @attachment.metadata.present?
  end

  # PUT /contributions/:contribution_id/attachments/:id
  def update
    current_user.may_edit_attachment!(@attachment)
    @attachment.build_metadata unless @attachment.metadata.present?
    @attachment.metadata.cataloguing = true if current_user.may_catalogue_contribution?(@attachment.contribution)
    if @attachment.update_attributes(params[:attachment])
      flash[:notice] = t('flash.attachments.update.notice')
      if @contribution.submitted?
        redirect_to @attachment.contribution
      else
        redirect_to new_contribution_attachment_path(@contribution)
      end
    else
      flash.now[:alert] = t('flash.attachments.update.alert')
      render :action => 'edit'
    end
  end

  # GET /contributions/:contribution_id/attachments/:id/copy
  def copy
    current_user.may_copy_attachment_metadata!(@attachment)
  end
  
  # PUT /contributions/:contribution_id/attachments/:id/duplicate
  def duplicate
    current_user.may_copy_attachment_metadata!(@attachment)
    if params[:targets].present?
      params[:targets].each do |attachment_id|
        if attachment = Attachment.find(attachment_id, :include => :metadata)
          if attachment.contribution_id == @attachment.contribution_id
            attachment.title = @attachment.title
            attachment.metadata.taxonomy_terms = @attachment.metadata.taxonomy_terms
            MetadataRecord.fields.each do |mf| 
              if mf.field_type != 'taxonomy'
                attachment.metadata.send(:"#{mf.column_name}=", @attachment.metadata.send(mf.column_name))
              end
            end
            attachment.save
          end
        end
      end
    end
    
    flash[:notice] = t('flash.attachments.duplicate.notice')
    redirect_to @attachment.contribution
  end

  # GET /contributions/:contribution_id/attachments/:id/delete
  def delete
    current_user.may_delete_attachment!(@attachment)
  end

  # DELETE /contributions/:contribution_id/attachments/:id
  def destroy
    current_user.may_delete_attachment!(@attachment)
    if @attachment.destroy
      flash[:notice] = t('flash.attachments.destroy.notice')
      redirect_to new_contribution_attachment_path(@contribution)
    else
      flash.now[:alert] = t('flash.attachments.destroy.alert')
      render :template => 'delete'
    end
  end

  protected
  def find_contribution
    @contribution = Contribution.find(params[:contribution_id], :include => [ :contributor, :attachments ])
  end

  def find_attachment
    @attachment = @contribution.attachments.find(params[:attachment_id] || params[:id], :include => [ :metadata ])
  end
end

