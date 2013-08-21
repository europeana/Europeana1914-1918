module Admin::UsersHelper
  def user_roles
    [ 'administrator', 'cataloguer', 'institutional_provider', 'contributor' ].map do |role_name| 
      [ I18n.t(role_name, :scope => 'activerecord.options.user.role_name'), role_name ]
    end.sort do |x,y|
      x.first <=> y.first
    end
  end
  
  def user_role_options_for_select(selected = nil)
    options_for_select([[ t('activerecord.options.user.role_name.blank'), nil ]] + user_roles, selected)
  end
end
