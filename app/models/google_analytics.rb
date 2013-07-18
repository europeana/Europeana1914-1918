##
# Interface to Google Analytics data via Legato.
#
# @see Legato::Model
#
class GoogleAnalytics
  extend Legato::Model

  metrics :visits, :timeonsite, :pageviews
  dimensions :pagePath
  
  filter :object_pageviews, &lambda { contains(:pagePath, '/contributions/\d+(/attachments/\d+)?$') }
end
