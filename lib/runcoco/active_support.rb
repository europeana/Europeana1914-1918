module ActiveSupport
  module Cache
    class Store
      def public_read_entry(key, options = nil)
        read_entry(key, options)
      end
    end
  end
end
