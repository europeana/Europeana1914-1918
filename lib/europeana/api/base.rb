module Europeana
  module API
    class Base
    protected
      def net_get(uri)
        retries = 5
        
        begin
          http = Net::HTTP.new(uri.host, uri.port)
          request = Net::HTTP::Get.new(uri.request_uri)
          http.request(request)
        rescue Timeout::Error, Errno::ECONNREFUSED, EOFError
          retries -= 1
          raise unless retries > 0
          sleep 10
          retry
        end
      end
    end
  end
end
