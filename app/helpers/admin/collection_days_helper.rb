module Admin::CollectionDaysHelper
  def collection_days_without_records_for_select(current_id = nil)
    collection_day_ids = CollectionDay.all.collect(&:taxonomy_term_id)
    terms = MetadataField.find_by_name('collection_day').taxonomy_terms
    terms.reject! { |term| collection_day_ids.include?(term.id) && (current_id != term.id) }
    terms.collect { |t| [ t.term, t.id ] }
  end
end
