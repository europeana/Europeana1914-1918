module ActiveSupport
  module Cache
    class FileStore
      # ActiveSupport 3.0.20's #cleanup calls missing #each_key method
      def each_key(options = nil)
        options = merged_options(options)
        search_dir(cache_path) do |path|
          yield file_path_key(path)
        end
      end
    end
  end
end
