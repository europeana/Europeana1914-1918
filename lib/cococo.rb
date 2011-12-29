# CoCoCo application library.
module CoCoCo
  autoload :Configuration, 'cococo/configuration'
  autoload :ErrorLogger, 'cococo/error_logger'
  autoload :FlashSessionCookieMiddleware, 'cococo/flash_session_cookie_middleware'

  class FieldNameInvalid < Exception; end # :nodoc:
  class BadRequest < Exception; end # :nodoc:
  class SearchOffline < Exception; end # :nodoc:
  
  # Configuration.
  @@configuration = nil
  
  # Error logger.
  @@error_logger = nil
  
  class << self
    # Returns the error logger.
    #
    # Error log file will be $RAILS_ROOT/log/$RAILS_ENV.error.log,
    # for example "/var/www/cococo/log/production.error.log".
    def error_logger
      @@error_logger ||= CoCoCo::ErrorLogger.new
    end
    
    # Returns the configuration object.
    #
    #   CoCoCo.configuration.site_name # => "CoCoCo"
    def configuration
      @@configuration ||= CoCoCo::Configuration.new
    end
  end
end

