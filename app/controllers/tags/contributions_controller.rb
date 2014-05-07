##
# Handles ActsAsTaggableOn tagging of contributions
#
class Tags::ContributionsController < TagsController
  def find_taggable
    @taggable = Contribution.find(params[:contribution_id], :include => :tags)
  end
  
  def taggable_path(taggable)
    contribution_path(taggable)
  end
end
