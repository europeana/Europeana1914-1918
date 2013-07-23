# Set default options for URLs from site URL config setting entered at
# /admin/config/edit.
site_url = URI.parse(RunCoCo.configuration.site_url)
default_url_options = { :locale => I18n.locale, :host => site_url.host, :port => site_url.port, :scheme => site_url.scheme }
Rails.application.routes.default_url_options.merge!(default_url_options)
( Rails.application.config.action_mailer.default_url_options ||= {} ).merge!( :locale => I18n.locale, :host => site_url.host, :port => site_url.port, :scheme => site_url.scheme )
