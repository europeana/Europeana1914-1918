##
# Handles ActsAsTaggableOn tagging of contributions
#
class Tags::EuropeanaRecordsController < TagsController
  def find_taggable
    record_id = '/' + params[:dataset_id] + '/' + params[:record_id]
    @taggable = EuropeanaRecord.find_by_record_id(record_id, :include => :tags)
  end
  
  def taggable_path(taggable)
    show_europeana_path(taggable.dataset_id, taggable.provider_record_id)
  end
end
