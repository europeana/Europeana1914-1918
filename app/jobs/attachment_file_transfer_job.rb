class AttachmentFileTransferJob
  def initialize(attachment_id, file_upload)
    @attachment_id = attachment_id
    
    tempfile_name = File.basename(file_upload.tempfile.path) + File.extname(file_upload.original_filename)
    FileUtils.mv(file_upload.tempfile.path, tempfile_path(tempfile_name))
    
    file_hash = {
      :content_type => file_upload.content_type.respond_to?(:content_type) ? file_upload.content_type.content_type : file_upload.content_type,
      :original_filename => file_upload.original_filename,
      :tempfile_name => tempfile_name
    }
    
    @file = file_hash
  end
  
  def perform
    attachment = Attachment.find(@attachment_id)
    attachment.file = File.open(tempfile_path(@file[:tempfile_name]))
    attachment.file_content_type = @file[:content_type]
    attachment.file_file_name = @file[:original_filename]
    attachment.save
    File.unlink(tempfile_path(@file[:tempfile_name]))
  end
  
protected

  def tempfile_path(tempfile_name)
    File.join(Rails.root, 'tmp', 'files', tempfile_name)
  end

end
