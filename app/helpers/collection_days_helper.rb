module CollectionDaysHelper
  def collection_day_summary(collection_day)
    summary = h(collection_day.code) + ': ' + h(collection_day.name) + ', ' + h(l(collection_day.start_date))
    if collection_day.end_date.present?
      summary = summary + ' &ndash; '.html_safe + h(l(collection_day.end_date))
    end
    summary
  end
end
