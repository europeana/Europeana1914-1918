# Export of the collection
class Export < ActiveRecord::Base
  belongs_to :user
  
  Paperclip.interpolates :integer_timestamp do |attachment, style|
    Time.at(attachment.updated_at).strftime('%Y%m%d%H%M%S')
  end
  
  Paperclip.interpolates :format_extension do |attachment, style|
    case attachment.instance.format 
    when 'XML'
      '.xml.gz'
    when 'CSV'
      '.csv'
    else
      ''
    end
  end

  has_attached_file :file,
    :path => (Paperclip::Attachment.default_options[:storage] == :filesystem ? ":rails_root/private/" : "") + "exports/collection-:integer_timestamp:format_extension",
    :url => (Paperclip::Attachment.default_options[:storage] == :s3 ? ":s3_domain_url" : "/exports/collection-:integer_timestamp:format_extension"),
    :s3_permissions => "private"
end
