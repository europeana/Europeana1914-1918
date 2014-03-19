module RunCoCo
  module HasRecordStatuses
    def self.included(base)
      raise ArgumentError, "#{base.to_s} does not subclass ActiveRecord::Base" unless base.ancestors.include?(ActiveRecord::Base)
      base.extend ClassMethods
    end
      
    module ClassMethods
      def has_record_statuses(*statuses)
        has_many :statuses, :class_name => 'RecordStatus', :as => :record, 
          :order => 'created_at ASC', :dependent => :destroy
          
        has_one :current_status, :class_name => 'RecordStatus', :as => :record,
          :order => 'created_at DESC'
        
        self.send :define_singleton_method, :valid_record_statuses do
          statuses.collect(&:to_s)
        end
        
        self.send :define_singleton_method, :with_status do |status|
          joins("INNER JOIN (SELECT record_id, status FROM record_statuses WHERE id=(SELECT id FROM record_statuses record_statuses_sub WHERE record_type='#{self.base_class.to_s}' AND record_statuses_sub.record_id=record_statuses.record_id ORDER BY record_statuses_sub.created_at DESC LIMIT 1)) current_status ON #{self.base_class.table_name}.id=current_status.record_id").where([ "current_status.status IN (?)", [ status ].flatten ])
        end
        
        ##
        # Changes the object's current status to that passed by creating a new RecordStatus record.
        #
        # @param [Symbol,String] status The status to change this contribution to.
        # @param [Integer] user_id The ID of the user making this status change.
        # @return [Boolean] True if the {RecordStatus} record saved.
        #
        self.send :define_method, :change_status_to do |status, user_id|
          record_status = RecordStatus.create(:record => self, :user_id => user_id, :status => status.to_s)
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
