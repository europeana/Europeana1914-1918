require 'runcoco/formtastic'

# RunCoCo application library.
module RunCoCo
  autoload :Configuration, 'runcoco/configuration'
  autoload :ErrorLogger, 'runcoco/error_logger'
  autoload :FlashSessionCookieMiddleware, 'runcoco/flash_session_cookie_middleware'

  class FieldNameInvalid < Exception; end # :nodoc:
  class BadRequest < Exception; end # :nodoc:
  class SearchOffline < Exception; end # :nodoc:

  class << self
    # Returns the error logger.
    #
    # Error log file will be $RAILS_ROOT/log/$RAILS_ENV.error.log,
    # for example "/var/www/runcoco/log/production.error.log".
    def error_logger
      @error_logger ||= RunCoCo::ErrorLogger.new
    end
    
    # Returns the configuration object.
    #
    #   RunCoCo.configuration.site_name # => "RunCoCo"
    def configuration
      @configuration ||= RunCoCo::Configuration.new
    end
  end
end

