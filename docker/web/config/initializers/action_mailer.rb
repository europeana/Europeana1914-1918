RunCoCo::Application.configure do
  ( config.action_mailer.default_url_options ||= {} ).merge!( :locale => I18n.locale,
:host => 'www.europeana1914-1918.eu'
)
  config.action_mailer.delivery_method = :sendmail
  config.action_mailer.sendmail_settings = {:arguments => "-i"}
end
