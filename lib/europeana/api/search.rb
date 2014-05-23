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
    class Search < Base
      ##
      # Base URL for Search API requests
      #
      BASE_URL = 'http://www.europeana.eu/api/v2/search.json'
      
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
        search_uri = uri(options)
        Rails.logger.debug("Europeana API search URL: #{search_uri.to_s}")
        response = net_get(search_uri)
        json = JSON.parse(response.body)
        raise Errors::RequestError, json['error'] unless json['success']
        @result_set = json
      rescue JSON::ParserError
        raise Errors::ResponseError
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
        
        facets = params.delete(:facets)
        
        uri = URI.parse(BASE_URL)
        uri.query = params.to_query
        
        if facets
          facets.each_pair do |name, criteria|
            [ criteria ].flatten.each do |criterion|
              uri.query = uri.query + "&qf=" + CGI::escape(name) + ":" + CGI::escape(criterion.add_quote_marks)
            end
          end
        end
        
        uri
      end
    end
  end
end
