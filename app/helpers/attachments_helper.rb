module AttachmentsHelper
  def allowed_file_types
    if RunCoCo.configuration.allowed_upload_extensions.present?
      RunCoCo.configuration.allowed_upload_extensions.split(',').sort.to_sentence
    else
      I18n.t('media_types.all')
    end
  end
  
  def max_upload_size
    number_to_human_size(RunCoCo.configuration.max_upload_size, :precision => 2)
  end
  
  # :thumb, :preview, :original
  def attachment_preview(attachment, size = :thumb)
    if attachment.image? && File.exists?(attachment.file.path(size))
      image_tag(attachment.file.url(size), :alt => (attachment.title.present? ? attachment.title : attachment.file.original_filename) )
    else
      media_type = file_media_type(attachment.file.original_filename)
      image_tag(image_path("style/icons/mimetypes/#{media_type}.png"), :alt => translate("media_types.#{media_type}"), :class => 'media-type-icon')
    end
  end
  
  def file_media_type(filename)
    mime_type_map = {  
      'binary' => [ 'application/octet-stream' ],
      'pdf' => [ 'application/pdf' ],
      'sound' => [ /^audio\// ],
      'spreadsheet' => [ 'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.ms-excel', 'application/excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ],
      'txt' => [ /^text\// ],
      'video' => [ /^video\// ],
      'wordprocessing' => [ 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ' text/richtext', 'application/vnd.oasis.opendocument.text' ]
    }
    
    mime_type = MIME::Types.type_for(filename).first.to_s
    mime_type_map.each_pair do |key, value|
      value.each do |pattern|
        return key if mime_type.match(pattern)
      end
    end
    
    'unknown'
  end
end
