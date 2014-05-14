module TagsHelper
  def taggable_type(taggable)
    taggable.class.to_s.underscore
  end
end
