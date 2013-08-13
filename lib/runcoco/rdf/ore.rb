module RDF
  ##
  # Object Reuse and Exchange (ORE) vocabulary.
  #
  # @see http://www.openarchives.org/ore/datamodel
  class ORE < Vocabulary("http://www.openarchives.org/ore/terms/")
    property :aggregates
    property :Aggregation
    property :AggregatedResource
    property :describes
    property :isAggregatedBy
    property :isDescribedBy
    property :lineage
    property :Proxy
    property :proxyFor
    property :proxyIn
    property :ResourceMap
    property :similarTo
  end
end
