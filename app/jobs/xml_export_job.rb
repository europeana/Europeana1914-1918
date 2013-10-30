# DelayedJob processor for XML exports
class XMLExportJob < ExportJob
  FORMAT    = 'XML'
  EXTENSION = '.xml.gz'
  
  include ContributionsHelper
  include Rails.application.routes.url_helpers
  
  def perform
    Zlib::GzipWriter.open(self.file.path) do |gz|
      xml = Builder::XmlMarkup.new(:target => gz, :indent => 2)
      xml.instruct!
      xml.collection do
        Contribution.export(@filters) do |contribution|
          export_contribution(xml, contribution)
        end
      end
    end
  end
  
protected

  def export_contribution(xml, contribution)
    builder_filename = File.join(Rails.root, 'app', 'views', 'contributions', '_export.xml.builder')
    builder_string = File.read(builder_filename)
    metadata_fields = MetadataField.all.collect { |mf| mf.name }
    instance_eval(builder_string)
  end
end
