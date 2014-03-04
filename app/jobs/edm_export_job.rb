# DelayedJob processor for EDM exports
class EDMExportJob < ExportJob
  FORMAT    = 'EDM'
  EXTENSION = '.edm.xml'
  GZIP      = true
  
  def perform
    controller = ContributionsController.new
    pattern = /<rdf:RDF[^>]*>(.*?)<\/rdf:RDF>/m
    
    ::ActiveRecord::Base.cache do
      File.open(self.file.path, 'w') do |file|
        file << <<-XML
<?xml version="1.0" encoding="UTF-8"?>
<RDF:rdf xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:edm="http://www.europeana.eu/schemas/edm/" xmlns:ore="http://www.openarchives.org/ore/terms/" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">
        XML
        
        Contribution.export(@filters) do |contribution|
          if edm = controller.cached(contribution, :xml).match(pattern)
            file << edm[1]
          end
        end
        
        file << <<-XML
</RDF:rdf>
        XML
      end
    end
  end
end
