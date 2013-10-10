module ActiveSupport
  module Cache
    class Store
      def public_read_entry(key, options = nil)
        read_entry(key, options)
      end
    end
    
    class DalliStore
      alias :public_read_entry :read
    end
  end
end
