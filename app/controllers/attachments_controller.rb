class AttachmentsController < ApplicationController
  before_filter :find_contribution
  before_filter :find_attachment, :except => [ :index, :new, :create ]

  # GET /contributions/:contribution_id/attachments
  def index
    current_user.may_view_contribution_attachments!(@contribution)
    @attachments = @contribution.attachments
    respond_to do |format|
      format.html do
        if params[:carousel] && (session[:theme] = 'v2')
          render :partial => '/attachments/carousel', :locals => {
            :attachments => @attachments.paginate(:page => params[:page], :per_page => params[:count] || 3 ),
            :contribution => @contribution
          }
        else
          render :action => 'index'
        end
      end
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
      if params[:attachment].has_key?(:dropbox_path) && params[:attachment][:dropbox_path].present?
        attachment_attributes.delete(:file)
      end
    end
    
    @attachment.attributes = attachment_attributes
    @attachment.metadata.cataloguing = true if current_user.may_catalogue_contributions?
    @attachment.contribution = @contribution
    
    unless attachment_attributes.is_a?(Hash) && attachment_attributes.has_key?(:metadata_attributes) && attachment_attributes[:metadata_attributes].has_key?(:field_license_term_ids)
      license = MetadataField.find_by_name('license').taxonomy_terms.select { |tt| tt.term == 'http://creativecommons.org/licenses/by-sa/3.0/' }.first
      @attachment.metadata.field_license_term_ids = [ license.id ]
    end
    
    unless attachment_attributes.is_a?(Hash) && attachment_attributes.has_key?(:metadata_attributes) && attachment_attributes[:metadata_attributes].has_key?(:field_file_type_term_ids)
      text = MetadataField.find_by_name('file_type').taxonomy_terms.select { |tt| tt.term == 'TEXT' }.first
      @attachment.metadata.field_file_type_term_ids = [ text.id ]
    end
    
    if attachment_attributes.is_a?(Hash) && attachment_attributes[:dropbox_path].present? && dropbox_configured? && dropbox_authorized?
      begin
        dropbox_metadata = dropbox_client.metadata(attachment_attributes[:dropbox_path])
        if dropbox_metadata['bytes'] > RunCoCo.configuration.max_upload_size
          raise DropboxError, t('activerecord.errors.models.attachment.attributes.file.size')
        end
        dropbox_file = dropbox_client.get_file(attachment_attributes[:dropbox_path])
        attachment_file = StringIO.new(dropbox_file)
        attachment_file.original_filename = File.basename(attachment_attributes[:dropbox_path])
        attachment_file.content_type = dropbox_metadata['mime_type']
        @attachment.file = attachment_file
      rescue DropboxError => exception
        dropbox_error = exception.error
      end
    end
    
    file_upload = attachment_attributes[:file]
    
    if dropbox_error.blank? && @attachment.valid?
      if (@attachment.file.options[:storage] == :filesystem) || file_upload.blank?
        @attachment.save
      else
        # @todo Move this into the Attachment model?
        @attachment.file = nil
        @attachment.file_file_size = file_upload.tempfile.size
        @attachment.save
        
        tempfile_path = File.join(Rails.root, 'tmp', 'files', File.basename(file_upload.tempfile.path) + File.extname(file_upload.original_filename))
        FileUtils.mv(file_upload.tempfile.path, tempfile_path)
        
        file_hash = {
          :content_type => file_upload.content_type.respond_to?(:content_type) ? file_upload.content_type.content_type : file_upload.content_type,
          :original_filename => file_upload.original_filename,
          :tempfile_path => tempfile_path
        }
        
        Delayed::Job.enqueue AttachmentFileTransferJob.new(@attachment.id, file_hash), :queue => Socket.gethostname
      end
      
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
      if dropbox_error.present?
        @attachment.valid?
        @attachment.errors.add(:dropbox_path, dropbox_error)
      end
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
    send_file_method = (@attachment.file.options[:storage] == :s3 ? :to_file : :path)
    send_file @attachment.file.send(send_file_method, style), :type => @attachment.file.content_type, :disposition => 'inline'
  end

  # GET /contributions/:contribution_id/attachments/:id/:filename
  def download
    current_user.may_view_attachment!(@attachment)
    send_file_method = (@attachment.file.options[:storage] == :s3 ? :to_file : :path)
    send_file @attachment.file.send(send_file_method), :type => @attachment.file.content_type
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
      # Updates made by non-cataloguers change the contribution's status to
      # :revised
      if !current_user.may_catalogue_contributions? && (@attachment.contribution.status == :approved)
        @attachment.contribution.change_status_to(:revised, current_user.id)
      end
      flash[:notice] = t('flash.attachments.update.notice')
      if @contribution.status == :draft
        redirect_to new_contribution_attachment_path(@contribution)
      else
        redirect_to @attachment.contribution
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
            MetadataRecord.fields.each do |mf|
              unless [ :cover_image, :page_number, :object_side ].include?(mf.name.to_sym)
                if mf.field_type == 'taxonomy'
                  attachment.metadata.send(:"#{mf.collection_id}=", @attachment.metadata.send(mf.collection_id))
                else
                  attachment.metadata.send(:"#{mf.column_name}=", @attachment.metadata.send(mf.column_name))
                end
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

