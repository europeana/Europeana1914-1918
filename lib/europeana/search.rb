require 'active_support/deprecation'

module Europeana
  module Search
    include ActiveSupport::Deprecation
    
    ##
    # @deprecated Use {Europeana::API.key=}
    # @note Retained for backwards compatibility with europeana.rb initializer.
    #
    def self.key=(key)
      warn "Europeana::Search.key= has been deprecated.  Please use Europeana::API.key= instead."
      API.key = key
    end
  end
end
