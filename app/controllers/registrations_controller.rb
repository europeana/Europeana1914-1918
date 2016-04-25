class RegistrationsController < Devise::RegistrationsController
  def create
    resource = build_resource
    
    valid = resource.valid?
    captcha_verified = verify_recaptcha(model: resource, attribute: :captcha,
                                        message: t('activerecord.errors.models.user.captcha'))

    if [valid, captcha_verified].all? { |b| b == true }
      resource.save
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_navigational_format?
        sign_in(resource_name, resource)
        respond_with resource, :location => redirect_location(resource_name, resource)
      else
        set_flash_message :notice, :inactive_signed_up, :reason => resource.inactive_message.to_s if is_navigational_format?
        expire_session_data_after_sign_in!
        respond_with resource, :location => after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords(resource)
      respond_with_navigational(resource) { render_with_scope :new }
    end
  end
end
