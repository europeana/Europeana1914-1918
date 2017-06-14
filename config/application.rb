require File.expand_path('../boot', __FILE__)

require 'rails/all'

if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require *Rails.groups(:assets => %w(development test))
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end

module RunCoCo
  class Application < Rails::Application
    LANG_LABELS = YAML::load_file(File.expand_path('../languages.yml', __FILE__))
    
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = "AttachmentSweeper", "ContactSweeper",
    #   "ContributionSweeper"
    config.active_record.observers = :metadata_mapping_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*/*.rb,yml are auto loaded.
    config.i18n.enforce_available_locales = true
    config.i18n.load_path = Dir[Rails.root.join('config', 'locales', '*', '*.{rb,yml}').to_s]
    config.i18n.default_locale = :en
    config.i18n.available_locales = Dir[Rails.root.join('config', 'locales', '*.yml').to_s].map { |yml| File.basename(yml, '.yml') } & LANG_LABELS.keys.collect(&:to_s)
    # the I18n.default_locale when a translation can not be found)
    config.i18n.fallbacks = true

    # For deployment through an iframe as part of the europeana portal, the application needs to load a JS and CSS file
    # The value provided here is not a stable version, you should specify a fixed version in:
    # config/initializers/e7a_1418_iframe.rb
    config.e7a_1418_iframe_source = 'http://styleguide.europeana.eu'

    # JavaScript files you want as :defaults (application.js is always included).
    # config.action_view.javascript_expansions[:defaults] = %w(jquery rails)

    config.paths['app/views'] = [ "#{Rails.root}/app/views/common" ]

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Enable the asset pipeline
    config.assets.enabled = true

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # Additional assets to precompile
    config.assets.precompile += [
      'mediaelementplayer.js', 'pdf.js', 'pdf.worker.js',
      'annotorious.css', 'mediaelementplayer.css', 'pdf.css',
      '*/javascripts/eu/europeana/pages/*.js',
      /\/stylesheets\/[^\/]*\.css\Z/,
      /\/javascripts\/[^\/]*\.js\Z/,
    ]
  end
end

require File.expand_path('../../lib/europeana', __FILE__)
require 'europeana/edm/mapping/railtie'
