##
# The Contact model holds a person's contact details.
#
# Attributes:
# * full_name
# * street_address
# * locality (city/town)
# * region (state/county/province)
# * postal_code
# * country
# * tel
# * email
class Contact < ActiveRecord::Base
  attr_accessible :full_name, :street_address, :locality, :region,
                  :postal_code, :country, :tel, :email,
                  :age, :gender, :user_attributes

  # An associated user will not necessarily exist.
  # If it does, this contact model will hold that user's contact details.
  has_one :user, :dependent => :nullify

  accepts_nested_attributes_for :user
  
  def self.full_name(given, family)
    [ given, family ].reject(&:blank?).join(' ')
  end
end
