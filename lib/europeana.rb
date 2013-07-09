require 'feedzirra'

module Europeana
  autoload :Search, 'europeana/search'
  autoload :OAI,    'europeana/oai'
end

Feedzirra::Feed.add_feed_class Europeana::Search::ResultSet
