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
  
  validates_format_of :code, :with => /\A[a-zA-Z0-9\-_.!~*'()]+\Z/
  
  default_scope order("code ASC")
  
  def oai_set(spec_prefix = "")
    OAI::Set.new(:spec => "#{spec_prefix}#{code}", :name => name)
  end
end
