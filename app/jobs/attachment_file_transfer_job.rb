class AttachmentFileTransferJob
  def initialize(attachment_id, file)
    @attachment_id = attachment_id
    @file = file
  end
  
  def perform
    attachment = Attachment.find(@attachment_id)
    attachment.file = File.open(@file[:tempfile_path])
    attachment.file_content_type = @file[:content_type]
    attachment.file_file_name = @file[:original_filename]
    attachment.save
    File.unlink(@file[:tempfile_path])
  end
end
