module Europeana
  module API
    class Base
    protected
      def net_get(uri)
        retries = 5
        
        begin
          Net::HTTP.get(uri)
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
