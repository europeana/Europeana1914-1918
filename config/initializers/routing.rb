# Set default options for URLs from site URL config setting entered at
# /admin/config/edit.
site_url = URI.parse(RunCoCo.configuration.site_url)

# Need to do this to prevent port appearing twice in generated URLs (e.g.
# <http://localhost:3000:3000/> when included as :port option.
host_with_port = site_url.host
host_with_port << ':' + site_url.port.to_s unless (site_url.port == 80 || site_url.port.blank?)

default_url_options = { :locale => I18n.locale, :host => host_with_port , :protocol => site_url.scheme }

Rails.application.routes.default_url_options.merge!(default_url_options)
( Rails.application.config.action_mailer.default_url_options ||= {} ).merge!(default_url_options)
