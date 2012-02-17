# Customised Devise session controller.
#
# Allows login by either username or email.
class Users::SessionsController < Devise::SessionsController
  # POST /resource/sign_in
  def create
    if resource_name == :user && params['user']
      if params['user']['username'].present? && params['user']['email'].blank?
        if user = User.find_by_username(params['user']['username'])
          params['user']['email_was'] = params['user']['email']
          params['user']['email'] = user.email
        end
      end
      if params['user']['email'].present? && params['user']['username'].blank?
        if user = User.find_by_email(params['user']['email'])
          params['user']['username_was'] = params['user']['username']
          params['user']['username'] = user.username
        end
      end
    end

    super
  end
  
  # GET /resource/sign_in
  def new
    if resource_name == :user && params['user']
      if params['user'].has_key?('username_was')
        params['user']['username'] = params['user'].delete('username_was')
      end
      if params['user'].has_key?('email_was')
        params['user']['email'] = params['user'].delete('email_was')
      end
    end
    
    super
  end
end
