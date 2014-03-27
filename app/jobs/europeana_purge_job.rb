class EuropeanaPurgeJob

  def perform
    get_record_ids
    purge_absent_records
  end
  
protected

  def get_record_ids
    start = 1
    rows = 100
    total = nil
    @record_ids = []
    
    while total.nil? || (start < total)
      response = get_api_search_results(start, rows)
      total = response['totalResults']
      return unless response['items'].present?
      @record_ids = @record_ids + response['items'].collect { |item| item['id'] }
      start += rows
    end
  end

  def get_api_search_results(start, rows)
    query_string = '"first world war" OR "world war I" OR "1914-1918" NOT europeana_collectionName:"2020601_Ag_ErsterWeltkrieg_EU"'
    query_options = {
      :start    => start,
      :rows     => rows,
      :profile  => 'minimal'
    }
    
    Europeana::API::Search.new(query_string).run(query_options)
  end
  
  def purge_absent_records
    EuropeanaRecord.select('id, record_id').find_in_batches do |batch|
      batch.each do |er|
        er.destroy unless @record_ids.include?(er.record_id)
      end
    end
  end

end
