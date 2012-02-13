# Authenticated users.
# Uses Devise for authentication and Aegis for role-based authorization.
# TODO: Prevent deletion of last admin user.
class User < ActiveRecord::Base
  # Devise authentication
  devise :database_authenticatable, :recoverable, :validatable, :registerable
  
  # Aegis roles
  has_role :default => 'guest'
  
  has_many :contributions, :foreign_key => 'contributor_id', :dependent => :destroy do
    def submitted
      where("submitted_at IS NOT NULL").includes([{:attachments => :metadata}, :metadata ])
    end
    def draft
      where("submitted_at IS NULL").includes([{:attachments => :metadata}, :metadata ])
    end
  end
  has_many :approved_contributions, :class_name => 'Contribution', :foreign_key => 'approved_by', :dependent => :nullify
  belongs_to :contact, :dependent => :destroy
  
  has_attached_file :picture, :styles => { :thumb => "100x100>", :medium => "200x200>" }, 
    :path => ":rails_root/public/images/users/:id/:style/:filename",
    :url => "/images/users/:id/:style/:filename"

  accepts_nested_attributes_for :contact
  attr_accessible :email, :password, :password_confirmation, :contact_attributes, :terms, :picture
  
  # Default role for saved accounts is contributor
  before_validation lambda { |u| u.role_name = 'contributor' if u.role_name.to_s == 'guest' }, :on => :create

  before_save :sync_email
  
  validates_presence_of :role_name, :contact
  validates_associated :contact
  validates_acceptance_of :terms, :allow_nil => false, :accept => true, :if => Proc.new { |u| u.role_name == 'contributor' }
  
  validates_attachment_content_type :picture, :content_type => [ 'image/jpeg', 'image/pjpeg', 'image/gif' ], :message => I18n.t('activerecord.errors.models.user.attributes.picture.content_type')

  # Sets contact email to user email
  # It is expected that the contact email field would be hidden
  # for contact records associated with users to avoid confusion.
  def sync_email
    if contact.present?
      contact.email = email
    end
  end
end

