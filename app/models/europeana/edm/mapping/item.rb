module Europeana
  module EDM
    module Mapping
      ##
      # Maps an +Attachment+ to EDM
      #
      # Shared for all item mappings.
      class Item < Base
        ##
        # The edm:WebResource URI of this attachment
        #
        # @return [RDF::URI] URI
        #
        def web_resource_uri
          url = @source.file.url(:original, :timestamp => false)
          if @source.file.options[:storage] == :filesystem
            url = RunCoCo.configuration.site_url + url
          end
          @web_resource_uri ||= RDF::URI.parse(url)
        end
      end
    end
  end
end
