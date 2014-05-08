# encoding: utf-8
module CollectionDaysHelper
  def collection_day_summary(collection_day)
    summary = collection_day.name + ', ' + l(collection_day.start_date)
    if collection_day.end_date.present?
      summary = summary + ' – ' + l(collection_day.end_date)
    end
    summary
  end
end
