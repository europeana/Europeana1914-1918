require 'acts_as_taggable_on/tagging'

class ActsAsTaggableOn::Tagging
  self.class_eval do
    acts_as_taggable_on :flags
  end
end

ActsAsTaggableOn.remove_unused_tags = true
