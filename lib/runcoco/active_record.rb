class ActiveRecord::Base
  class << self
    def has_record_statuses(*statuses)
      has_many :status_logs, :class_name => 'RecordStatusLog', :as => :record
      
      self.send :define_singleton_method, :valid_record_statuses do
        statuses
      end
      
      self.send :define_method, :current_status do
        status_logs.order("created_at DESC").limit(1).first
      end
    end
  end
end
