# DelayedJob processor for XML exports
class XMLExportJob < ExportJob
  FORMAT    = 'XML'
  EXTENSION = '.xml'
  GZIP      = true
  
  include ContributionsHelper
  include Rails.application.routes.url_helpers
  
  def perform
    ::ActiveRecord::Base.cache do
      File.open(self.file.path, 'w') do |file|
        xml = Builder::XmlMarkup.new(:target => file, :indent => 2)
        xml.instruct!
        xml.collection do
          Contribution.export(@filters) do |contribution|
            export_contribution(xml, contribution)
          end
        end
      end
    end
  end
  
protected

  def export_contribution(xml, contribution)
    builder_filename = File.join(Rails.root, 'app', 'views', 'common', 'contributions', '_export.xml.builder')
    builder_string = File.read(builder_filename)
    metadata_fields = MetadataField.all.collect { |mf| mf.name }
    instance_eval(builder_string)
  end
end
