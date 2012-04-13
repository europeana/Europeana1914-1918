##
# Application user.
#
# Uses Devise for authentication and Aegis for role-based authorization.
class User < ActiveRecord::Base
  # Devise authentication
  devise :database_authenticatable, :recoverable, :registerable
  
  # Aegis roles
  has_role :default => 'guest'
  
  has_many :contributions, :foreign_key => 'contributor_id', :dependent => :destroy do
    def submitted
      where([ 'contribution_statuses.status IN (?)', [ ContributionStatus::SUBMITTED, ContributionStatus::APPROVED ] ]).includes([{:attachments => :metadata}, :metadata, :current_status ])
    end
    def draft
      where([ 'contribution_statuses.status=?', ContributionStatus::DRAFT ]).includes([{:attachments => :metadata}, :metadata, :current_status ])
    end
  end
  has_many :catalogued_contributions, :class_name => 'Contribution', :foreign_key => 'catalogued_by', :dependent => :nullify
  belongs_to :contact, :dependent => :destroy
  
  has_attached_file :picture, :styles => { :thumb => "100x100>", :medium => "200x200>" }, 
    :path => ":rails_root/public/images/users/:id/:style/:filename",
    :url => "/images/users/:id/:style/:filename"

  accepts_nested_attributes_for :contact
  
  attr_accessible :username, :email, :password, :password_confirmation, :contact_attributes, :terms, :picture
  
  # Default role for saved accounts is contributor
  before_validation lambda { |u| u.role_name = 'contributor' if u.role_name.to_s == 'guest' }, :on => :create

  before_save :sync_email
  
  validates_presence_of :username
  validates_uniqueness_of :username
  validates_length_of :username, :minimum => 3, :allow_blank => true
  validates_format_of :username, :with => /^[a-zA-Z0-9\-\_\.\@]+$/, :allow_blank => true, :if => Proc.new { |u| u.new_record? || u.username_changed? }
  
  validates_presence_of :role_name, :contact
  validates_associated :contact
  validates_acceptance_of :terms, :allow_nil => false, :accept => true, :if => Proc.new { |u| u.role_name == 'contributor' }
  
  validates_uniqueness_of :email, :scope => Devise.authentication_keys[1..-1], :case_sensitive => false, :allow_blank => true
  validates_format_of     :email, :with  => Devise.email_regexp, :allow_blank => true

  with_options :if => :password_required? do |v|
    v.validates_presence_of     :password
    v.validates_confirmation_of :password
    v.validates_length_of       :password, :within => Devise.password_length, :allow_blank => true
  end
  
  validates_attachment_content_type :picture, :content_type => [ 'image/jpeg', 'image/pjpeg', 'image/gif' ], :message => I18n.t('activerecord.errors.models.user.attributes.picture.content_type')

  # Sets contact email to user email
  # It is expected that the contact email field would be hidden
  # for contact records associated with users to avoid confusion.
  def sync_email
    if contact.present?
      contact.email = email
    end
  end

  protected
  # Checks whether a password is needed or not. For validations only.
  # Passwords are always required if it's a new record, or if the password
  # or confirmation are being set somewhere.
  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end
end

