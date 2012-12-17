require 'oai'

class OaiProvider < OAI::Provider::Base
  repository_name RunCoCo.configuration.site_name
  admin_email Devise.mailer_sender
  source_model ::OaiProviderActiveRecordWrapper.new(::PublishedContribution, { :limit => 100 })
  register_format ::OaiMetadataFormat.instance
end

