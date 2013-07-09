module ContactsHelper
  def full_name(given, family)
    Contact.full_name(given, family)
  end
end
