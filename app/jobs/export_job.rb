class ExportJob
  include ContributionsHelper
  include Rails.application.routes.url_helpers
  
  def initialize(options = {})
    @username = options.delete(:username)
    @email    = options.delete(:email)
    @filters  = options
  end
  
  def perform
    timestamp = Time.now.strftime('%Y%m%d%H%M%S')
    xml_filename = "collection-#{timestamp}.xml.gz"
    xml_filepath = File.join(Rails.root, 'private', 'exports', xml_filename)
    
    Zlib::GzipWriter.open(xml_filepath) do |gz|
      xml = Builder::XmlMarkup.new(:target => gz, :indent => 2)
      xml.instruct!
      xml.collection do
        Contribution.export(@filters) do |contribution|
          export_contribution(xml, contribution)
        end
      end
    end
    
    RunCoCo.export_logger.info("Export to XML by #{@username} saved as #{xml_filename}")
    if @email.present?
      ExportsMailer.complete(@email, xml_filename).deliver
    end
    puts "Export to XML by #{@username} saved as #{xml_filename}"
  end
  
protected

  def export_contribution(xml, contribution)
    builder_filename = File.join(Rails.root, 'app', 'views', 'contributions', '_export.xml.builder')
    builder_string = File.read(builder_filename)
    metadata_fields = MetadataField.all.collect { |mf| mf.name }
    instance_eval(builder_string)
  end
end
