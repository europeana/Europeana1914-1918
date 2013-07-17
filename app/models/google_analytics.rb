##
# Interface to Google Analytics data via Legato.
#
# @see Legato::Model
#
class GoogleAnalytics
  extend Legato::Model

  metrics :visits, :timeonsite
end
