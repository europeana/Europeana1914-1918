# DelayedJob processor for EDM exports
class EDMExportJob < ExportJob
  FORMAT    = 'EDM'
  EXTENSION = '.xml.gz'
  
  def perform
    controller = ContributionsController.new
  
    Zlib::GzipWriter.open(self.file.path) do |gz|
      xml = Builder::XmlMarkup.new(:target => gz, :indent => 2)
      xml.instruct!
    
      xml.RDF(:rdf, {
        "xmlns:rdf" => "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "xmlns:skos" => "http://www.w3.org/2004/02/skos/core#", 
        "xmlns:dcterms" => "http://purl.org/dc/terms/",
        "xmlns:dc" => "http://purl.org/dc/elements/1.1/",
        "xmlns:edm" => "http://www.europeana.eu/schemas/edm/",
        "xmlns:ore" => "http://www.openarchives.org/ore/terms/",
        "xmlns:geo" => "http://www.w3.org/2003/01/geo/wgs84_pos#"
      } ) do |rdf|
    
        Contribution.export(@filters) do |contribution|
          Rails.logger.debug("EDM export contribution ID: #{contribution.id}")
          edm = Nokogiri::XML(controller.cached(contribution, :xml))
          rdf << edm.css('rdf|RDF > *').to_xml
        end
      end
    end
  end
end
