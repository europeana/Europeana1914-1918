# DelayedJob processor for EDM exports
class EDMExportJob < ExportJob
  FORMAT    = 'EDM'
  EXTENSION = '.edm.xml'
  GZIP      = true
  
  def perform
    contributions_controller  = ContributionsController.new
    attachments_controller    = AttachmentsController.new
    pattern = /<rdf:RDF[^>]*>(.*?)<\/rdf:RDF>/m
    
    ::ActiveRecord::Base.cache do
      File.open(self.file.path, 'w') do |file|
        file << '<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:edm="http://www.europeana.eu/schemas/edm/" xmlns:ore="http://www.openarchives.org/ore/terms/" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">' << "\n"
        
        Contribution.export(@filters) do |contribution|
          if contribution_edm = contributions_controller.cached(contribution, :xml).match(pattern)
            file << contribution_edm[1]
            
            if contribution.attachments.size > 1
              contribution.attachments[1..-1].each do |attachment|
                if attachment_edm = attachments_controller.cached(attachment, :xml).match(pattern)
                  file << attachment_edm[1]
                end
              end
            end
          end
        end
        
        file << "\n</rdf:RDF>"
      end
    end
  end
end
