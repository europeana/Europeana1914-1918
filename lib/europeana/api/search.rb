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
      # Creates a new search object.
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
        response = JSON.parse(Net::HTTP.get(uri(options)))
        raise Errors::RequestError, response['error'] unless response['success']
        @result_set = response
      end
      
      ##
      # Constructs the URI for the Search query
      #
      # @param [Hash] options Optional parameters
      # @option options [String,Integer] :rows The number of records to return; 
      #   the maximum value is 100 (default is 12).
      # @option options [String,Integer] :start The item in the search results 
      #   to start with; first item is 1 (default is 1).
      # @option options Any other options are passed as-is to the API.
      #
      # @return [URI] Query URI
      #
      def uri(options = {})
        raise Errors::MissingKeyError unless Europeana::API.key.present?
        
        params = options.dup.merge( {
          :query => @terms,
          :wskey => Europeana::API.key
        } )
        
        params[:rows] = [ (params[:rows] || 12).to_i, 100 ].min
        params[:start] = params[:start] || 1
        
        uri = URI.parse(BASE_URL)
        uri.query = params.to_query
        uri
      end
    end
  end
end
