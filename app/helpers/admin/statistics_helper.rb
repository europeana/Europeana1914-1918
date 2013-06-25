module Admin::StatisticsHelper
  def collection_day_options_for_select(selected = nil)
    collection_days = MetadataField.find_by_name('collection_day').taxonomy_terms.collect { |t| [ t.term, t.id ] }
    options_for_select([[ '', nil ]] + collection_days, selected)
  end
  
  def month_options_for_select(selected = nil)
    month_names = t('date.month_names')
    months = 1.upto(12).collect do |month_number|
      [ month_names[month_number], month_number ]
    end
    options_for_select([[ '', nil ]] + months, selected)
  end
end
