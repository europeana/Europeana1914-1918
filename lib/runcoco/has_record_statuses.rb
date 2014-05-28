module RunCoCo
  module HasRecordStatuses
    def self.included(base)
      raise ArgumentError, "#{base.to_s} does not subclass ActiveRecord::Base" unless base.ancestors.include?(ActiveRecord::Base)
      base.extend ClassMethods
    end
      
    module ClassMethods
      def has_record_statuses(*statuses)
        has_many :statuses, :class_name => 'RecordStatus', :as => :record, 
          :order => 'created_at ASC, id ASC', :dependent => :destroy
          
        has_one :current_status, :as => :record, :dependent => :destroy
        
        scope :with_status, lambda { |*status_names|
          joins(:current_status).where([ "current_statuses.name IN (?)", [ *status_names ].flatten ])
        }
        
        self.send :define_singleton_method, :valid_record_statuses do
          statuses.collect(&:to_s)
        end
        
        ##
        # Changes the object's current status to that passed.
        #
        # If the object's current status is already that passed, nothing needs
        # to be done. Otherwise, status is changed by creating a new 
        # {RecordStatus} record.
        #
        # @param [Symbol,String] status The status to change this contribution to.
        # @param [Integer] user_id The ID of the user making this status change.
        # @return [Boolean] True if the {RecordStatus} record saved.
        #
        self.send :define_method, :change_status_to do |status, user_id|
          if current_status.present? && (current_status.to_sym == status.to_sym)
            return true
          end
          
          record_status = RecordStatus.create(:record => self, :user_id => user_id, :name => status.to_s)
          
          if record_status.id.present?
            if self.respond_to?(:updated_at)
              self.updated_at = record_status.created_at
              self.save
            else
              true
            end
          else
            false
          end
        end
      end
    end
  end
end
