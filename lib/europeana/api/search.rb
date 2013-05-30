require 'net/http'

module Europeana
  module API
    ##
    # Query the Europeana Search API.
    #
    # @example
    #   result_set = Europeana::API::Search.new('western front').run
    #   result_set['totalResults'] #=> 1234
    #   result_set['items'].first
    #
    class Search
      ##
      # Base URL for Search API requests
      #
      BASE_URL = 'http://europeana.eu/api/v2/search.json'
      
      ##
      # Search terms
      #
      attr_accessor :terms
      
      ##
      # Result set
      # 
      attr_reader :result_set
      
      ##
      # Creates a new query object.
      #
      # @param [String] terms Search term(s)
      #
      def initialize(terms)
        @terms = terms
      end
      
      ##
      # Runs the query against the API.
      #
      # @param (see #uri)
      # @return [Hash] Search results.
      # @see http://www.europeana.eu/portal/api-search-json.html Documentation 
      #   of response fields.
      #
      def run(options = {})
        @result_set = ActiveSupport::JSON.decode(Net::HTTP.get(uri(options)))
      end
      
      ##
      # Constructs the URI for the Search query
      #
      # @param [Hash] options Optional parameters
      # @option options [String,Integer] :rows The number of records to return; 
      #   the maximum value is 100 (default is 12).
      # @option options [String,Integer] :start The item in the search results 
      #   to start with; first item is 1 (default is 1).
      #
      # @return [URI] Query URI
      #
      def uri(options = {})
        raise Exception, 'Europeana API key not set' unless Europeana::API.key.present?
        
        options.assert_valid_keys(:rows, :start)
        
        rows = [ (options[:rows] || 12).to_i, 100 ].min
        start = options[:start] || 1
        
        params = {
          :query => @terms,
          :wskey => Europeana::API.key,
          :rows => rows,
          :start => start
        }
        
        uri = URI.parse(BASE_URL)
        uri.query = params.to_query
        uri
      end
    end
  end
end
