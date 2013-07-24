module RDF
  ##
  # Europeana Data Model (EDM) vocabulary.
  #
  # @see http://pro.europeana.eu/edm-documentation
  class EDM < Vocabulary("http://www.europeana.eu/schemas/edm/")
    property :Agent
    property :aggregatedCHO
    property :begin
    property :collectionName
    property :country
    property :currentLocation
    property :dataProvider
    property :end
    property :EuropeanaAggregation
    property :EuropeanaObject
    property :europeanaProxy
    property :Event
    property :happenedAt
    property :hasMet
    property :hasType
    property :hasView
    property :incorporates
    property :InformationResource
    property :isAnnotationOf
    property :isDerivativeOf
    property :isNextInSequence
    property :isRelatedTo
    property :isRepresentationOf
    property :isShownAt
    property :isShownBy
    property :isSimilarTo
    property :isSuccessorOf
    property :landingPage
    property :language
    property :NonInformationResource
    property :object
    property :occurredAt
    property :PhysicalThing
    property :Place
    property :preview
    property :ProvidedCHO
    property :provider
    property :realizes
    property :rights
    property :TimeSpan
    property :type
    property :ugc
    property :unstored
    property :uri
    property :userTag
    property :wasPresentAt
    property :WebResource
    property :year
  end
end
