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
  
  class TimeWithZone
    def self.w3cdtf(date)
      Time.w3cdtf(date)
    end
    
    def w3cdtf
      if usec.zero?
        fraction_digits = 0
      else
        fraction_digits = Math.log10(usec.to_s.sub(/0*$/, '').to_i).floor + 1
      end
      xmlschema(fraction_digits)
    end
  end
end
