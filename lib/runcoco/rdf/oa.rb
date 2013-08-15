module RDF
  ##
  # Open Annotation (OA) vocabulary.
  #
  # @see http://www.openannotation.org/spec/core/
  class OA < Vocabulary("http://www.w3.org/ns/oa#")
    property :annotatedAt
    property :annotatedBy
    property :Annotation
    property :bookmarking
    property :cachedSource
    property :Choice
    property :classifying
    property :commenting
    property :Composite
    property :CssStyle
    property :DataPositionSelector
    property :default
    property :describing
    property :editing
    property :end
    property :equivalentTo
    property :exact
    property :FragmentSelector
    property :hasBody
    property :hasScope
    property :hasSelector
    property :hasSource
    property :hasState
    property :hasTarget
    property :highlighting
    property :HttpRequestState
    property :identifying
    property :item
    property :linking
    property :List
    property :moderating
    property :motivatedBy
    property :Motivation
    property :motivationScheme
    property :prefix
    property :questioning
    property :replying
    property :Selector
    property :SemanticTag
    property :serializedAt
    property :serializedBy
    property :SpecificResource
    property :start
    property :State
    property :Style
    property :styleClass
    property :styledBy
    property :suffix
    property :SvgSelector
    property :Tag
    property :tagging
    property :TextPositionSelector
    property :TextQuoteSelector
    property :TimeState
    property :when
  end
end
