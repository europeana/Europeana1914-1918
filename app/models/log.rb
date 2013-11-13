class Log < ActiveRecord::Base
  validates_inclusion_of :level, :in => %w( fatal error warn info debug )
  validates_presence_of :log_type, :message
  
  class << self
    def fatal(type, message)
      create(:level => "fatal", :log_type => type, :message => message)
    end
    
    def error(type, message)
      create(:level => "error", :log_type => type, :message => message)
    end
    
    def warn(type, message)
      create(:level => "warn", :log_type => type, :message => message)
    end
    
    def info(type, message)
      create(:level => "info", :log_type => type, :message => message)
    end
    
    def debug(type, message)
      create(:level => "debug", :log_type => type, :message => message)
    end
  end
  
  def before_create
    self.timestamp = Time.now
  end
end
