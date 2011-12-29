module UsersHelper
  def contact_name(contact)
    if contact
      contact.full_name
    else
      raw('<em>' + t('views.contacts.no_name') + '</em>')
    end
  end
end
