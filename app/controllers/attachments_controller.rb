class AttachmentsController < ApplicationController
  before_filter :find_contribution
  before_filter :find_attachment, :except => [ :index, :new, :create ]

  # GET /contributions/:contribution_id/attachments
  def index
    current_user.may_view_contribution_attachments!(@contribution)
    @attachments = @contribution.attachments
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
    if params[:uploadify]
      params[:attachment][:file].content_type = MIME::Types.type_for(params[:attachment][:file].original_filename).first
    end
    @attachment = Attachment.new
    @attachment.build_metadata
    @attachment.attributes = params[:attachment]
    @attachment.metadata.cataloguing = true if current_user.may_catalogue_contribution?(@attachment.contribution)
    @attachment.contribution = @contribution
    
    unless params.has_key?(:attachment) && params[:attachment].has_key?(:metadata_attributes) && params[:attachment][:metadata_attributes].has_key?(:field_license_term_ids)
      license = MetadataField.find_by_name('license').taxonomy_terms.select { |tt| tt.term == 'http://creativecommons.org/licenses/by-sa/3.0/' }.first
      @attachment.metadata.field_license_term_ids = [ license.id ]
    end
    
    if @attachment.save
      respond_to do |format| 
        flash[:notice] = t('flash.attachments.create.notice') + ' ' + t('flash.attachments.links.view-attachments_html')
        format.html do
          if @contribution.submitted?
            redirect_to @attachment.contribution
          else
            redirect_to new_contribution_attachment_path(@contribution)
          end
        end
        format.json  { render :json => { :result => 'success', :url => contribution_attachment_path(@contribution, @attachment) } } 
      end 
    else
      flash.now[:alert] = t('flash.attachments.create.alert')
      respond_to do |format| 
        format.html { render :action => 'new', :status => :bad_request }
        format.json  { render :json => { :result => 'error', :msg => @attachment.errors.values.flatten.to_sentence } } 
      end
    end
  end

  # GET /contributions/:contribution_id/attachments/:id
  def show
    current_user.may_view_attachment!(@attachment)
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

