module Europeana
  module OAI
    class Provider < ::OAI::Provider::Base
      register_format MetadataFormat.instance
    end
  end
end
