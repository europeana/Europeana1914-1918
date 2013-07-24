module RDF
  ##
  # Europeana Data Model (EDM) vocabulary.
  #
  # @see http://pro.europeana.eu/edm-documentation
  class EDM < Vocabulary("http://www.europeana.eu/schemas/edm/")
    property :aggregatedCHO
    property :begin
    property :collectionName
    property :country
    property :currentLocation
    property :dataProvider
    property :end
    property :europeanaProxy
    property :happenedAt
    property :hasMet
    property :hasType
    property :hasView
    property :incorporates
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
    property :object
    property :occurredAt
    property :preview
    property :provider
    property :realizes
    property :rights
    property :type
    property :ugc
    property :unstored
    property :uri
    property :userTag
    property :wasPresentAt
    property :year
  end
end
