# DelayedJob processor for EDM exports
# TODO: switch to using stored MetadataMapping, not controller cache hack
class EDMExportJob < ExportJob
  FORMAT    = 'EDM'
  EXTENSION = '.edm.xml'
  GZIP      = true

  def perform
    contributions_controller  = ContributionsController.new
    attachments_controller    = AttachmentsController.new


    ::ActiveRecord::Base.cache do
      File.open(self.file.path, 'w') do |file|
        file << '<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:edm="http://www.europeana.eu/schemas/edm/" xmlns:ore="http://www.openarchives.org/ore/terms/" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">' << "\n"

        Contribution.export(@filters) do |contribution|
          if contribution_edm = order_edm_rdf_xml(contributions_controller.cached(contribution, :xml))
            file << contribution_edm

            if contribution.attachments.size > 1
              contribution.attachments[1..-1].each do |attachment|
                if attachment_edm = order_edm_rdf_xml(attachments_controller.cached(attachment, :xml))
                  file << attachment_edm
                end
              end
            end
          end
        end

        file << "\n</rdf:RDF>"
      end
    end
  end

protected

  def order_edm_rdf_xml(rdf)
    edm_match = rdf.match(/<rdf:RDF[^>]*>(.*?)<\/rdf:RDF>/m)
    return false if edm_match.nil?

    output = ''

    edm = edm_match[1]

    if cho_match = edm.match(/\s*<edm:ProvidedCHO[^>]*>.*?<\/edm:ProvidedCHO>/m)
      cho = cho_match[0]
      edm.gsub!(cho, '')
      output << cho
    end

    if web_match = edm.match(/\s*<edm:WebResource[^>]*>.*?<\/edm:WebResource>/m)
      web = web_match[0]
      edm.gsub!(web, '')
      output << web
    end

    if agg_match = edm.match(/\s*<ore:Aggregation[^>]*>.*?<\/ore:Aggregation>/m)
      agg = agg_match[0]
      edm.gsub!(agg, '')
      output << agg
    end

    output << edm

    output
  end

end
