require 'active_support'

module RunCoCo
  class Logger < ActiveSupport::BufferedLogger
    SEVERITY_NAME = %w( DEBUG INFO WARN ERROR FATAL UNKNOWN )

    def initialize(name, level = DEBUG)
      log = File.join(Rails.root, 'log', "#{Rails.env}.#{name}.log")
      super(log, level)
    end

    def add(severity, message = nil, progname = nil, &block)
      message = [Time.zone.now.strftime("%Y-%m-%d %H:%M:%S"), SEVERITY_NAME[severity], message].join(' ')
      super(severity, message, progname, &block)
    end
  end
end
