module Europeana
  module Search
    ##
    # Query the Europeana OpenSearch API.
    #
    # @example
    #   result_set = Europeana::Search::Query.new('western front').run
    #   result_set.total_results #=> 1234
    #   result_set.results.first
    #
    class Query
      ##
      # Base URL for OpenSearch API requests
      #
      BASE_URL = 'http://api.europeana.eu/api/opensearch.rss'
      
      ##
      # Search terms
      #
      attr_accessor :terms
      
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
      # @return [Array<Europeana::Search::ResultSet>] Search results.
      #
      def run(options = {})
        Feedzirra::Feed.fetch_and_parse(uri(options).to_s)
      end
      
      ##
      # Runs the query with pagination options.
      #
      # @param (see #uri)
      # @return [WillPaginate::Collection] Paginated result set
      #
      def paginate(options = {})
        result_set = run(options)
        
        WillPaginate::Collection.create options[:page] || 1,
                                        12,
                                        result_set.total_results do |pager|
          pager.replace result_set.results
        end
      end
      
      ##
      # Constructs the URI for the OpenSearch query
      #
      # @param [Hash] options Optional parameters
      # @option params [String,Integer] :page The page of results to obtain.
      #   Default is 1.
      #
      # @return [URI] Query URI
      def uri(options = {})
        raise Exception, 'Europeana OpenSearch API key not set' unless Europeana::Search.key.present?
        
        options.assert_valid_keys(:page)
        
        params = {
          :searchTerms => @terms,
          :startPage => (options[:page] || 1),
          :wskey => Europeana::Search.key
        }
        
        uri = URI.parse(BASE_URL)
        uri.query = params.to_query
        uri
      end
    end
  end
end
