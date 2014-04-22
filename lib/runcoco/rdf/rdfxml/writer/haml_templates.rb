# Default HAML templates used for generating RDF/XML output from the writer
module RDF::RDFXML
  class Writer
    # The default set of HAML templates used for RDFa code generation
    ENCODED_HAML = BASE_HAML
    ENCODED_HAML[:property_value] = %q(
      - if res = yield(object)
        - haml_tag(property) do
          = res
      - elsif object.literal? && object.datatype == RDF.XMLLiteral
        - haml_tag(property, :"<", "rdf:parseType" => "Literal") do
          = object.value
      - elsif object.literal?
        - haml_tag(property, :"<", "xml:lang" => object.language, "rdf:datatype" => (object.datatype unless object.plain?)) do
          = Builder::XChar.encode(object.value)
      - elsif object.node?
        - haml_tag(property, :"/", "rdf:nodeID" => object.id)
      - else
        - haml_tag(property, :"/", "rdf:resource" => relativize(object))
    )
  end
end
