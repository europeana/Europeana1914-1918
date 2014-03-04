##
# Abstract base class for export jobs
#
# Sub-classes need to define:
# * FORMAT: a string describing the export format, e.g. "XML"
# * EXTENSION: a string specifying the file extension, e.g. ".xml.gz"
# * GZIP (optional): true/false; whether to gzip the output before saving
# * #perform: to write the export output to @file
#
class ExportJob
  GZIP = false
  
  attr_accessor :file, :export
  
  def initialize(options = {})
    @user_id  = options.delete(:user_id)
    @filters  = options
  end
  
  def perform
    raise RuntimeError, "Subclass ExportJob and implement #perform"
  end
  
  def before(job)
    self.file = Tempfile.new(['export', self.class::EXTENSION], :encoding => 'utf-8')
    self.file.close
  end
  
  def success(job)
    if self.class::GZIP
      Zlib::GzipWriter.open(self.file.path + '.gz') do |gz|
        File.open(self.file.path).each do |line|
          gz.write line
        end
      end
      export_file = File.open(self.file.path + '.gz')
    else
      export_file = self.file.open
    end

    self.export = Export.new(:user => user, :format => self.class::FORMAT)
    self.export.file = export_file
    self.export.save
    
    filename = File.basename(self.export.file.path)
    Log.info("export", "Export to #{self.class::FORMAT} by #{self.export.user.username} saved as #{filename}")
    if self.export.user.email.present?
      ExportsMailer.complete(self.export).deliver
    end
    
    if self.class::GZIP
      File.unlink(self.file.path + '.gz')
    end
    self.file.unlink
  end
  
  def failure(job)
    Log.error("export", "Export to #{self.class::FORMAT} by #{self.export.user.username} FAILED")
    self.file.unlink
  end
  
protected

  def user
    User.find(@user_id)
  end
end
