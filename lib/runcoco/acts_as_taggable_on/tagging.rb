module ActsAsTaggableOn
  class Tagging
    has_record_statuses :published, :flagged, :unpublished, :revised
  end
end
