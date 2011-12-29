require 'active_support'
module CoCoCo
  class ErrorLogger < ActiveSupport::BufferedLogger
    SEVERITY_NAME = %w( DEBUG INFO WARN ERROR FATAL UNKNOWN )

    def initialize(level = DEBUG)
      log = File.join(Rails.root, 'log', "#{Rails.env}.error.log")
      super(log, level)
    end

    def add(severity, message = nil, progname = nil, &block)
      return if @level > severity
      message = (message || (block && block.call) || progname).to_s
      # If a newline is necessary then create a new message ending with a newline.
      # Ensures that the original message is not mutated.
      message = "#{message}\n" unless message[-1] == ?\n
      message = [Time.zone.now.strftime("%Y-%m-%d %H:%M:%S"), SEVERITY_NAME[severity], message].join(' ')
      buffer << message
      auto_flush
      message
    end
  end
end
