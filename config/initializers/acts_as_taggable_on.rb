require 'acts_as_taggable_on/tagging'

class ActsAsTaggableOn::Tagging
  self.class_eval do
    acts_as_taggable_on :flags
    
    # Prevent multiple users adding the same tag to a Contribution
    validates_uniqueness_of :tag_id, :scope => [ :taggable_type, :taggable_id, :context ], 
      :if => Proc.new { |tagging| tagging.taggable_type == "Contribution" && tagging.context == "tags" }
  end
end

ActsAsTaggableOn.remove_unused_tags = true
