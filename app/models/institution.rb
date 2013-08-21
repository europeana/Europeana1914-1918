##
# The institution with which a user may be associated.
#
# Institutional user accounts get their own filtered exports (XML/OAI-PMH).
#
class Institution < ActiveRecord::Base
  has_many :users, :dependent => :nullify
  has_many :contributions, :through => :users
  
  validates_presence_of :code, :name
  validates_uniqueness_of :code
end
