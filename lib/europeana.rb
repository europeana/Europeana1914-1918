require 'feedzirra'

##
# Interface to the Europeana OpenSearch API.
#
# @see http://pro.europeana.eu/reuse/api
#
module Europeana
  autoload :Search, 'europeana/search'
end

Feedzirra::Feed.add_feed_class Europeana::Search::ResultSet
