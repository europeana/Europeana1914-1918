# Export of the collection
class Export < ActiveRecord::Base
  belongs_to :user
  
  Paperclip.interpolates :integer_timestamp do |attachment, style|
    Time.at(attachment.updated_at).strftime('%Y%m%d%H%M%S')
  end

  has_attached_file :file,
    :path => (Paperclip::Attachment.default_options[:storage] == :filesystem ? ":rails_root/private/" : "") + "exports/collection-:integer_timestamp.xml.gz",
    :url => (Paperclip::Attachment.default_options[:storage] == :s3 ? ":s3_domain_url" : "/exports/collection-:integer_timestamp.xml.gz"),
    :s3_permissions => "private"
end
