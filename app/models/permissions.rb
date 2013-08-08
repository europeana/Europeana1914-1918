##
# Aegis roles and permissions.
#
# @see <http://wiki.github.com/makandra/aegis/>.
#
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
  
  action :administer_metadata_fields do
    deny :cataloguer
  end

  action :administer_contributions do
  end
  
  action :administer_settings do
    deny :cataloguer
  end
  
  action :view_logs do
    deny :cataloguer
  end
  
  action :catalogue_contributions do
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
    allow :guest do |contribution|
      (RunCoCo.configuration.publish_contributions? && contribution.published?) ||
      (!RunCoCo.configuration.registration_required? && (contribution.contact == user.contact))
    end
    allow :contributor do |contribution|
      (RunCoCo.configuration.publish_contributions? && contribution.published?) || 
      (contribution.contributor == user)
    end
  end
  
  action :view_contribution_status_log do
  end
  
  action :edit_contribution do
    allow :contributor do |contribution|
      (contribution.contributor == user) && [ :draft, :submitted, :approved, :revised ].include?(contribution.status)
    end
    allow :guest do |contribution|
      !RunCoCo.configuration.registration_required? && (contribution.contact == user.contact) && (contribution.status == :draft)
    end
  end
  
  action :tag_contribution do
    allow :administrator, :cataloguer, :contributor do |contribution|
      contribution.published?
    end
  end
  
  action :untag_contribution do
    allow :cataloguer, :contributor do |tag|
      tag.taggings.collect(&:tagger_id).include?(user.id)
    end
  end
  
  action :flag_contribution_tag do
    allow :administrator, :cataloguer, :contributor do |tag|
      !tag.taggings.collect(&:tagger).include?(user) &&
      !tag.taggings.collect(&:flags).flatten.uniq.collect(&:taggings).flatten.collect(&:tagger_id).include?(user.id)
    end
  end
  
  action :approve_contributions do
  end
  
  action :reject_contributions do
  end

  action :delete_contribution do
    allow :contributor do |contribution|
      (contribution.contributor == user) && (contribution.status == :draft)
    end
    allow :guest do |contribution|
      !RunCoCo.configuration.registration_required? && (contribution.contact == user.contact) && (contribution.status == :draft)
    end
  end
  
  action :withdraw_contribution do
    allow :cataloguer, :administrator do |contribution|
      [ :submitted, :approved, :revised ].include?(contribution.status)
    end
    allow :contributor do |contribution|
      (contribution.contributor == user) && ([ :submitted, :approved, :revised ].include?(contribution.status))
    end
  end
  
  action :view_contribution_attachments do
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
    allow :contributor do |contribution|
      (contribution.contributor == user) && ([ :draft, :submitted, :revised ].include?(contribution.status))
    end
    allow :guest do |contribution|
      !RunCoCo.configuration.registration_required? && (contribution.contact == user.contact) && (contribution.status == :draft)
    end
  end

  action :view_attachment do
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
      (attachment.contribution.contributor == user) && [ :draft, :submitted, :approved, :revised ].include?(attachment.contribution.status)
    end
    allow :guest do |attachment|
      !RunCoCo.configuration.registration_required? && (attachment.contribution.contact == user.contact) && (attachment.contribution.status == :draft)
    end
  end
  
  action :copy_attachment_metadata do
  end
  
  action :delete_attachment do
    allow :contributor do |attachment| 
      (attachment.contribution.contributor == user) && [ :draft, :submitted ].include?(attachment.contribution.status)
    end
    allow :guest do |attachment|
      !RunCoCo.configuration.registration_required? && (attachment.contribution.contact == user.contact) && (attachment.contribution.status == :draft)
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

