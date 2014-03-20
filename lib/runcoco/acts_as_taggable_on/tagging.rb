# @todo Combine with related initializer
module ActsAsTaggableOn
  class Tagging
    has_record_statuses :published, :flagged, :depublished, :revised
    
    alias_method :hrs_change_status_to, :change_status_to
    def change_status_to(status, user_id)
      hrs_change_status_to(status, user_id)
      
      if status.to_sym == :depublished && taggable.respond_to?(:index!)
        taggable.tags(:reload => true)
        taggable.index!
      end
    end
  end
end
