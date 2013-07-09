module UsersHelper
  def contact_name(contact)
    if contact
      if contact.full_name.present?
        contact.full_name
      else
        if contact.user && contact.user.username.present? && !(contact.user.username =~ Devise.email_regexp)
          contact.user.username
        else
          raw('<em>' + t('views.contacts.anonymous') + '</em>')
        end
      end
    else
      raw('<em>' + t('views.contacts.no_name') + '</em>')
    end
  end
  
  def cataloguing_users
    User.where(:role_name => [ 'administrator', 'cataloguer' ]).includes(:contact).order('contacts.full_name')
  end
end
