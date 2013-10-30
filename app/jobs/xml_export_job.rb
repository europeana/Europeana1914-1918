# encoding: utf-8
# DelayedJob processor for XML exports
class ExportJob
  include ContributionsHelper
  include Rails.application.routes.url_helpers
  
  def initialize(options = {})
    @user_id  = options.delete(:user_id)
    @filters  = options
  end
  
  def perform
    file = Tempfile.new(['export', '.xml.gz'], :encoding => 'utf-8')
    file.close
    
    Zlib::GzipWriter.open(file.path) do |gz|
      xml = Builder::XmlMarkup.new(:target => gz, :indent => 2)
      xml.instruct!
      xml.collection do
        Contribution.export(@filters) do |contribution|
          export_contribution(xml, contribution)
        end
      end
    end
    
    export = Export.new
    export.user = user
    export.file = file.open
    export.save
    
    file.unlink
    
    xml_filename = File.basename(export.file.path)
    
    RunCoCo.export_logger.info("Export to XML by #{export.user.username} saved as #{xml_filename}")
    if export.user.email.present?
      ExportsMailer.complete(export).deliver
    end
    puts "Export to XML by #{export.user.username} saved as #{xml_filename}"
  end
  
protected

  def export_contribution(xml, contribution)
    builder_filename = File.join(Rails.root, 'app', 'views', 'contributions', '_export.xml.builder')
    builder_string = File.read(builder_filename)
    metadata_fields = MetadataField.all.collect { |mf| mf.name }
    instance_eval(builder_string)
  end
  
  def user
    User.find(@user_id)
  end
end
