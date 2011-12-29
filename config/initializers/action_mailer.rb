#( Rails.configuration.action_mailer.default_url_options ||= {} ).merge!( :locale => I18n.locale )

#Rails.configuration.action_mailer.default_url_options = { :host => 'http://europeana-gwa.isti.cnr.it' }

( Rails.configuration.action_mailer.default_url_options ||= {} ).merge!( :locale => I18n.locale, :host => 'www.europeana1914-1918.eu' )

Rails.configuration.action_mailer.delivery_method = :smtp

Rails.configuration.action_mailer.smtp_settings = {
  :address => 'smtp.isti.cnr.it',
  :port => 587,
  :authentication => :plain,
  :user_name => 'europeana',
  :password => '10.04.09'
}
