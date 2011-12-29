module Admin::UsersHelper
  def user_roles
    [ 'administrator', 'cataloguer', 'contributor' ].map do |ft| 
      [ I18n.t(ft, :scope => 'activerecord.options.user.role_name'), ft ]
    end.sort do |x,y|
      x.first <=> y.first
    end
  end
  
  def user_role_options_for_select(selected = nil)
    options_for_select([[ t('activerecord.options.user.role_name.blank'), nil ]] + user_roles, selected)
  end
end
