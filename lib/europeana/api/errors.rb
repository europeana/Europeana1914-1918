module Europeana
  module API
    module Errors
      class RequestError < StandardError # :nodoc:
        MESSAGE_TEMPLATE = 'Europeana API request failed with error "%s"'
        
        # @param [String] message The error message returned in the API response
        def initialize(message)
          super(sprintf(MESSAGE_TEMPLATE, message))
        end
      end
      
      class MissingKeyError < StandardError # :nodoc:
        DEFAULT_MESSAGE = 'The Europeana API key has not been set.'
        
        def initialize(message = nil)
          super(message || DEFAULT_MESSAGE)
        end
      end
      
      class ResponseError < StandardError
        DEFAULT_MESSAGE = 'Unable to parse the API response.'
        
        def initialize(message = nil)
          super(message || DEFAULT_MESSAGE)
        end
      end
    end
  end
end
