require 'oai'
class OaiProvider < OAI::Provider::Base
  repository_name RunCoCo.configuration.site_name
  admin_email Devise.mailer_sender
  source_model OAI::Provider::ActiveRecordWrapper.new(::Contribution.published)
end
