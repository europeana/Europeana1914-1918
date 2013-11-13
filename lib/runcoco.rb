require 'runcoco/active_support'
require 'runcoco/core_ext'
require 'runcoco/devise'
require 'runcoco/formtastic'
require 'runcoco/rdf'

##
# RunCoCo application library.
module RunCoCo
  autoload :BingTranslator,               'runcoco/bing_translator'
  autoload :Configuration,                'runcoco/configuration'
  autoload :Dropbox,                      'runcoco/dropbox'
  autoload :FlashSessionCookieMiddleware, 'runcoco/flash_session_cookie_middleware'
  autoload :Logger,                       'runcoco/logger'
  autoload :OEmbed,                       'runcoco/oembed'

  class FieldNameInvalid < Exception; end # :nodoc:
  class BadRequest < Exception; end # :nodoc:
  class SearchOffline < Exception; end # :nodoc:

  class << self
    ##
    # Returns the configuration object.
    #
    # @example Get the site name
    #   RunCoCo.configuration.site_name #=> "RunCoCo"
    #
    # @return [RunCoCo::Configuration]
    def configuration
      @configuration ||= Configuration.new
    end
    
    # @param [RunCoCo::Configuration)
    def configuration=(configuration)
      @configuration = configuration
    end

    ##
    # Returns the error logger.
    #
    # Error log file will be $RAILS_ROOT/log/$RAILS_ENV.error.log,
    # for example "/var/www/runcoco/log/production.error.log".
    #
    # @return [RunCoCo::Logger]
    def error_logger
      @error_logger ||= RunCoCo::Logger.new('error')
    end
  end
end

