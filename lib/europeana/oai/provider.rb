module Europeana
  module OAI
    class Provider < ::OAI::Provider::Base
      register_format MetadataFormat::EDM.instance

      class << self
        def formats
          @formats ||= {}
          @formats.delete('oai_dc')
          @formats
        end
      end
    end
  end
end
