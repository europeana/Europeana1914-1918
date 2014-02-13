module Europeana
  module API
    ##
    # Query the Europeana API Record method.
    #
    # @example
    #   id = '/09102/_GNM_1234'
    #   record = Europeana::API::Record.get(id)
    #   record['success'] #=> true
    #   record['object']['title'] #=> "Europeana record title"
    #
    class Record
      ##
      # Base URL for API Record requests, sprintf-formatted.
      #
      # The %s token will be replaced with the recordID.
      #
      BASE_URL = 'http://www.europeana.eu/api/v2/record/%s.json'
      
      class << self
        ##
        # Retrieves a record object over the API.
        #
        # @param [String] record_id Europeana record ID.
        # @return [Hash] Record object.
        # @see http://www.europeana.eu/portal/api-record-json.html Documentation
        #   of response object.
        #
        def get(record_id)
          record_uri = uri(record_id)
          Rails.logger.debug("Europeana API record URL: #{record_uri.to_s}")
          response = Net::HTTP.get(record_uri)
          json = JSON.parse(response)
          raise Errors::RequestError, json['error'] unless json['success']
          json
        rescue JSON::ParserError
          raise Errors::ResponseError
        end
      
        def uri(record_id)
          raise Errors::MissingKeyError unless Europeana::API.key.present?
          
          params = {
            :wskey => Europeana::API.key
          }
          
          uri = URI.parse(sprintf(BASE_URL, record_id))
          uri.query = params.to_query
          uri
        end
      end
    end
  end
end
