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
      element 'opensearch:itemsPerPage', :as => :per_page
      element 'opensearch:Query', :value => :startPage, :as => :page
      elements :item, :as => :results, :class => Result

      attr_accessor :feed_url

      def self.able_to_parse?(xml) #:nodoc:
        (/\<rss/ =~ xml) && xml.match('<link>http://api.europeana.eu/api/opensearch.rss').present?
      end
      
      ##
      # Returns the result set as a WillPaginate collection.
      #
      # This method does not take pagination options because the API result set
      # is already paginated.
      #
      # @return [WillPaginate::Collection] will_paginate compatibile result set.
      #
      def for_pagination
        WillPaginate::Collection.create(page, per_page, total_results) do |pager|
          pager.replace results
        end
      end
    end
  end
end
