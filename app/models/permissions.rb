# Aegis roles and permissions.
#
# See Aegis documentation at <http://wiki.github.com/makandra/aegis/>.
#
# TODO: Make more RESTful, as per <http://wiki.github.com/makandra/aegis/defining-permissions-with-resources>
class Permissions < Aegis::Permissions
  role :guest
  role :contributor
  role :cataloguer, :default_permission => :allow
  role :administrator, :default_permission => :allow
  
  action :access_admin_area do
  end

  action :administer_users do
    deny :cataloguer
  end
  
  action :may_export_contributions do
    deny :cataloguer
  end

  action :administer_metadata_fields do
    deny :cataloguer
  end

  action :administer_contributions do
  end
  
  action :administer_settings do
    deny :cataloguer
  end
  
  action :approve_contributions do
  end

  action :catalogue_contribution do
    # Even administrators can not catalogue contributions until they are submitted
    deny :administrator
    allow :administrator do |contribution|
      contribution.submitted?
    end
    deny :cataloguer
    allow :cataloguer do |contribution|
      contribution.submitted?
    end
  end
  
  action :search_contributions do
    if RunCoCo.configuration.publish_contributions?
      allow :everyone
    else
      deny :everyone
    end
  end
  
  action :create_contribution do
    allow :contributor
    allow :guest do
      !RunCoCo.configuration.registration_required? && user.contact.present?
    end
  end
  
  action :view_contribution do
    allow :administrator
    allow :cataloguer
    allow :guest do |contribution|
      (RunCoCo.configuration.publish_contributions? && contribution.published?) ||
      (!RunCoCo.configuration.registration_required? && (contribution.contact == user.contact))
    end
    allow :contributor do |contribution|
      (RunCoCo.configuration.publish_contributions? && contribution.published?) || 
      (contribution.contributor == user)
    end
  end

  action :edit_contribution do
    allow :contributor do |contribution|
      (contribution.contributor == user) && !contribution.submitted?
    end
    allow :guest do |contribution|
      !RunCoCo.configuration.registration_required? && (contribution.contact == user.contact) && !contribution.submitted?
    end
  end

  action :delete_contribution do
    allow :contributor do |contribution|
      (contribution.contributor == user) && !contribution.submitted?
    end
    allow :guest do |contribution|
      !RunCoCo.configuration.registration_required? && (contribution.contact == user.contact) && !contribution.submitted?
    end
  end
  
  action :view_contribution_attachments do
    allow :administrator
    allow :cataloguer
    allow :contributor do |contribution|
      (RunCoCo.configuration.publish_contributions? && contribution.published?) ||
      (contribution.contributor == user)
    end
    allow :guest do |contribution|
      (RunCoCo.configuration.publish_contributions? && contribution.published?) ||
      (!RunCoCo.configuration.registration_required? && (contribution.contact == user.contact))
    end
  end

  action :create_contribution_attachment do
    allow :administrator
    allow :cataloguer
    allow :contributor do |contribution|
      (contribution.contributor == user) && !contribution.submitted?
    end
    allow :guest do |contribution|
      !RunCoCo.configuration.registration_required? && (contribution.contact == user.contact) && !contribution.submitted?
    end
  end

  action :view_attachment do
    allow :administrator
    allow :cataloguer
    allow :contributor do |attachment|
      (RunCoCo.configuration.publish_contributions? && attachment.public?) || 
      (attachment.contribution.contributor == user)
    end
    allow :guest do |attachment|
      (RunCoCo.configuration.publish_contributions? && attachment.public?) ||
      (!RunCoCo.configuration.registration_required? && (attachment.contribution.contact == user.contact))
    end
  end
  
  action :edit_attachment do
    allow :contributor do |attachment|
      (attachment.contribution.contributor == user) && !attachment.contribution.submitted?
    end
    allow :guest do |attachment|
      !RunCoCo.configuration.registration_required? && (attachment.contribution.contact == user.contact) && !attachment.contribution.submitted?
    end
  end
  
  action :delete_attachment do
    allow :contributor do |attachment| 
      (attachment.contribution.contributor == user) && !attachment.contribution.submitted?
    end
    allow :guest do |attachment|
      !RunCoCo.configuration.registration_required? && (attachment.contribution.contact == user.contact) && !attachment.contribution.submitted?
    end
  end
  
  action :view_contact do
    allow :contributor do |contact|
      user.contact == contact
    end
  end

  action :edit_contact do
    allow :contributor do |contact|
      user.contact == contact
    end
  end
  
  action :create_guest_contact do
    # Only guest users can create guest contacts
    deny :cataloguer
    deny :administrator
    allow :guest do
      !RunCoCo.configuration.registration_required? && user.contact_id.nil?
    end
  end
  
  action :edit_guest_contact do
    deny :cataloguer
    deny :administrator
    allow :guest do
      !RunCoCo.configuration.registration_required?
    end
  end
end

