module Europeana
  module Search
    ##
    # Europeana OpenSearch API key.
    #
    # @see http://pro.europeana.eu/api
    mattr_accessor :key
  
    autoload :Query,      'europeana/search/query'
    autoload :ResultSet,  'europeana/search/result_set'
    autoload :Result,     'europeana/search/result'
  end
end
