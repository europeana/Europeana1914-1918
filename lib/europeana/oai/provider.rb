module Europeana
  module OAI
    class Provider < ::OAI::Provider::Base
      register_format MetadataFormat::Europeana19141918.instance
      register_format MetadataFormat::EDM.instance
    end
  end
end
