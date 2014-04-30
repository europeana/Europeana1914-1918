##
# The Contact model holds a person or organisation's contact details.
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
  
  attr_accessor :required_attributes
  
  after_initialize :initialize_required_attributes
  
  [ 
    :full_name, :street_address, :locality, :region, :postal_code, :country, 
    :tel, :email, :age, :gender 
  ].each do |attribute|
    validates attribute, :presence => true, :if => Proc.new { |c| c.required_attributes.include?(attribute) }
  end
  
  def self.full_name(given, family)
    [ given, family ].reject(&:blank?).join(' ')
  end
  
protected

  def initialize_required_attributes
    self.required_attributes = []
  end
  
end
