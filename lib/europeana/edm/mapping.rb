module Europeana
  module EDM
    ##
    # Mappings to EDM for local models
    #
    module Mapping
      autoload :Base, 'europeana/edm/mapping/base'
      
      def self.included(base)
        base.extend ClassMethods
      end
      
      module ClassMethods
        attr_reader :edm_mapping_class
        
        def has_edm_mapping(klass)
          @edm_mapping_class = klass
        end
      end
      
      def edm
        @edm_mapping ||= self.class.edm_mapping_class.new(self)
      end
    end
  end
end
