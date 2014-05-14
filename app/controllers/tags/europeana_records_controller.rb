##
# Handles ActsAsTaggableOn tagging of Europeana records
#
class Tags::EuropeanaRecordsController < TagsController
  def find_taggable
    record_id = '/' + params[:record_id]
    @taggable = EuropeanaRecord.find_by_record_id(record_id, :include => :tags)
  end
end
