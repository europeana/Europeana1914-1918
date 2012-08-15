require 'will_paginate/collection'

module Europeana
  module Search
    ##
    # Parser for Europeana OpenSearch result set RSS feed
    #
    class ResultSet
      include SAXMachine
      include Feedzirra::FeedUtilities
      element :title
      element :description
      element :link, :as => :url
      element 'opensearch:totalResults', :as => :total_results
      element 'opensearch:Query', :value => :startPage, :as => :page
      elements :item, :as => :results, :class => Result

      attr_accessor :feed_url

      def self.able_to_parse?(xml) #:nodoc:
        (/\<rss/ =~ xml) && xml.match('<link>http://api.europeana.eu/api/opensearch.rss').present?
      end
    end
  end
end
