##
# Abstract base class for export jobs
#
# Sub-classes need to define:
# * FORMAT: a string describing the export format, e.g. "XML"
# * EXTENSION: a string specifying the file extension, e.g. ".xml.gz"
# * #perform: to write the export output to @file
#
class ExportJob
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
    self.export = Export.new(:user => user, :format => self.class::FORMAT)
    self.export.file = self.file.open
    self.export.save
    
    filename = File.basename(self.export.file.path)
    Log.info("export", "Export to #{self.class::FORMAT} by #{self.export.user.username} saved as #{filename}")
    if self.export.user.email.present?
      ExportsMailer.complete(self.export).deliver
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
