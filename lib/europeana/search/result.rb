require 'cgi'

module Europeana
  module Search
    ##
    # Parser for Europeana OpenSearch result RSS feed entry
    #
    # OpenSearch response elements are mapped as follows, where entry is one of 
    # the returned search results:
    # - guid                      => entry.guid
    # - title                     => entry.title
    # - enclosure[@url]           => entry.enclosure_url
    # - dc:creator                => entry.author
    # - europeana:year            => entry.year
    # - europeana:type            => entry.type
    # - europeana:provider        => entry.provider
    # - europeana:dataProvider    => entry.data_provider
    #
    class Result
      include SAXMachine
      include Feedzirra::FeedUtilities
      
      element :guid
      element :title
      element :enclosure, :value => :url, :as => :enclosure_url
      element :"dc:creator", :as => :author
      element 'europeana:year', :as => :year
      element 'europeana:type', :as => :type
      element 'europeana:provider', :as => :provider
      element 'europeana:dataProvider', :as => :data_provider
      
      ##
      # Constructs the URL of the image for this result.
      #
      # @param [String] size Size of the image required.
      # @return [String] Image URL
      #
      def image_url(size = 'BRIEF_DOC')
        uri = URI.parse('http://europeanastatic.eu/api/image')
        uri_param = enclosure_url.blank? ? nil : CGI.unescapeHTML(enclosure_url)
        uri.query = { :type => type, :uri => uri_param, :size => size }.to_query
        uri.to_s
      end
    end
  end
end
