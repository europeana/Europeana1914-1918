require 'active_support/deprecation'
require 'europeana/search' # Ensure class from Gem is loaded first

module Europeana
  class Search
    include ActiveSupport::Deprecation
    
    ##
    # @deprecated Use {Europeana.api_key=}
    # @note Retained for backwards compatibility with europeana.rb initializer.
    #
    def self.key=(key)
      warn "Europeana::Search.key= has been deprecated. Please use Europeana.api_key= instead."
      Europeana.api_key = key
    end
  end
  
  module API
    include ActiveSupport::Deprecation
    
    class << self
      ##
      # @deprecated Use {Europeana.api_key=}
      # @note Retained for backwards compatibility with europeana.rb initializer.
      #
      def key=(key)
        warn "Europeana::API.key= has been deprecated. Please use Europeana.api_key= instead."
        Europeana.api_key = key
      end
      
      def key
        warn "Europeana::API.key has been deprecated. Please use Europeana.api_key instead."
        Europeana.api_key
      end
    end
  end
end
