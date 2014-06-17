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
  
  def attachment_title(attachment)
    if attachment.title.present?
      attachment.title
    else
      number = attachment.contribution.attachment_ids.index(attachment.id) + 1
      attachment.contribution.title + ' / ' + t('activerecord.models.attachment') + ' ' + number.to_s
    end
  end
  
  # :thumb, :preview, :original, :large
  def attachment_preview(attachment, size = :preview)
    if attachment.has_thumbnail?(size)
      alt = (attachment.title.present? ? attachment.title : attachment.file.original_filename)
    else
      media_type = attachment_file_media_type(attachment)
      alt = translate("media_types.#{media_type}")
    end
    
    image_tag(attachment_thumbnail_url(attachment, size), :alt => alt)
  end
  
  def attachment_thumbnail_url(attachment, size = :preview)
    if preview_url = attachment.thumbnail_url(size)
      preview_url
    else
      media_type = attachment_file_media_type(attachment)
      file_media_type_image_path(media_type)
    end
  end
  
  def attachment_url(attachment, size = :preview, options = {})
    attachment.image? ? attachment.file.url(size, options) : attachment.file.url(:original, options)
  end
  
  def attachment_file_media_type(attachment)
    file_media_type(attachment.file.original_filename)
  end
  
  def file_media_type_image_path(media_type)
    image_path("style/icons/mimetypes/#{media_type}.png")
  end
  
  def file_media_type(filename)
    return 'unknown' if filename.nil?
    
    mime_type_map = {
      'binary'          => [ 'application/octet-stream' ],
      'pdf'             => [ 'application/pdf' ],
      'sound'           => [ /^audio\// ],
      'spreadsheet'     => [ 'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.ms-excel', 'application/excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ],
      'txt'             => [ /^text\// ],
      'video'           => [ /^video\// ],
      'wordprocessing'  => [ 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ' text/richtext', 'application/vnd.oasis.opendocument.text' ]
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
