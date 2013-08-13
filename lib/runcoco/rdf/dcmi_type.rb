module RDF
  ##
  # DCMI Type Vocabulary.
  #
  # @see http://dublincore.org/documents/2000/07/11/dcmi-type-vocabulary/
  class DCMIType < Vocabulary("http://purl.org/dc/dcmitype/")
    property :Collection
    property :Dataset
    property :Event
    property :Image
    property :InteractiveResource
    property :Service
    property :Software
    property :Sound
    property :Text
  end
end
