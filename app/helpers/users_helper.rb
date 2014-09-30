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
  
  def cataloguing_users(contribution = nil)
    users = User.where(:role_name => [ 'administrator', 'cataloguer' ]).includes(:contact).order('contacts.full_name')
    
    # Handle the case where a contribution was already catalogued by a user
    # no longer of the role administrator or cataloguer.
    if contribution.present? && contribution.cataloguer.present? && !users.include?(contribution.cataloguer)
      users.unshift(contribution.cataloguer)
    end
    
    users
  end
end
