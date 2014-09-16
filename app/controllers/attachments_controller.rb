class AttachmentsController < ApplicationController
  before_filter :find_contribution
  before_filter :find_attachment, :except => [ :index, :new, :create ]

  cache_sweeper :attachment_sweeper, :only => [ :create, :update, :destroy ]

  # GET /contributions/:contribution_id/attachments
  def index
    current_user.may_view_contribution_attachments!(@contribution)
    @attachments = @contribution.attachments
    if params[:page] && params[:count]
      @attachments = @attachments.paginate(:page => params[:page], :per_page => params[:count])
    end
    respond_to do |format|
      format.html do
        # @todo Does this need to respond similarly for theme v3?
        if params[:carousel] && [ 'v2', 'v2.1' ].include?(session[:theme])
          render :partial => 'attachments/carousel', :locals => {
            :attachments => @attachments,
            :contribution => @contribution
          }
        else
          render :action => 'index'
        end
      end
      format.json do
        render :json => @attachments
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
    @attachment.post_process = false unless (@attachment.file.options[:storage] == :filesystem)

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
        @attachment.file = nil
        @attachment.file_file_size = file_upload.tempfile.size
        @attachment.save

        Delayed::Job.enqueue AttachmentFileTransferJob.new(@attachment.id, file_upload), :queue => Socket.gethostname
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
      format.html do
        if params[:layout] == '0'
          if @attachment.audio?
            render :partial => 'attachments/audio-video'
          elsif @attachment.pdf?
            render :partial => 'attachments/pdf'
          elsif @attachment.video?
            render :partial => 'attachments/audio-video'
          elsif @attachment.image?
            render :partial => 'attachments/book-image', :locals => {
                :attachments => @contribution.attachments
            }
          else
            render :layout => false
          end
        end
      end
      format.nt { render :text => cached(@attachment, :nt) }
      format.xml { render :xml => cached(@attachment, :xml) }
    end
  end

  # GET /contributions/:contribution_id/attachments/:id/:style/:filename
  def inline
    current_user.may_view_attachment!(@attachment)
    style = (params[:style] == 'full' ? 'original' : params[:style])
    send_attachment_file(@attachment, style, :disposition => 'inline')
  end

  # GET /contributions/:contribution_id/attachments/:id/:filename
  def download
    current_user.may_view_attachment!(@attachment)
    send_attachment_file(@attachment)
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

  # GET /contributions/:contribution_id/attachments/:id/uploaded
  def uploaded
    current_user.may_view_attachment!(@attachment)
    respond_to do |format|
      format.json
    end
  end

  def cached(attachment, format)
    cache_key = "attachments/#{format.to_s}/#{attachment.id}.#{format.to_s}"

    if fragment_exist?(cache_key)
      data = YAML::load(read_fragment(cache_key))
    else
      data = case format
        when :nt
          attachment.edm.to_ntriples
        when :xml
          attachment.edm.to_rdfxml
      end
      write_fragment(cache_key, data.to_yaml)
    end

    data
  end

protected

  def find_contribution
    @contribution = Contribution.find(params[:contribution_id], :include => [ :contributor, :attachments ])
  end

  def find_attachment
    @attachment = @contribution.attachments.find(params[:attachment_id] || params[:id], :include => [ :metadata ])
  end

  def send_attachment_file(attachment, style = :original, options = {})
    options.merge!(:type => attachment.file.content_type)
    if attachment.file.options[:storage] == :s3
      tmp_file = Tempfile.new('paperclip-s3')
      attachment.file.copy_to_local_file(style, tmp_file.path)
      tmp_file.close unless tmp_file.closed?
      send_file tmp_file.path, options
    else
      send_file attachment.file.path(style), options
    end
  end

end
