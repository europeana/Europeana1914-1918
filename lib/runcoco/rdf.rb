module RDF
  autoload :DCElement,  'runcoco/rdf/dc_element'
  autoload :DCMIType,   'runcoco/rdf/dcmi_type'
  autoload :EDM,        'runcoco/rdf/edm'
  autoload :OA,         'runcoco/rdf/oa'
  autoload :ORE,        'runcoco/rdf/ore'
end

require 'runcoco/rdf/rdfxml/writer/haml_templates'
