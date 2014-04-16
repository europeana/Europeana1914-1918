# @todo Combine with related initializer
module ActsAsTaggableOn
  class Tagging
    has_record_statuses :published, :flagged, :depublished, :revised
    
    after_update :index_taggable!, :if => :tag_id_changed?
    
    alias_method :hrs_change_status_to, :change_status_to
    def change_status_to(status, user_id)
      return false unless hrs_change_status_to(status, user_id)
      index_taggable! if status.to_sym == :depublished
      true
    end
    
    def index_taggable!
      if taggable.respond_to?(:index!)
        taggable.tags(:reload => true)
        taggable.index!
      end
    end
  end
end
