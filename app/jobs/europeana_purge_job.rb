class EuropeanaPurgeJob

  def perform
    get_record_ids
    purge_absent_records
  end
  
protected

  def get_record_ids
    start = 1
    rows = 100
    items = nil
    @record_ids = []
    
    begin
      response = get_api_search_results(start, rows)
      raise StandardError, "Europeana API request failed before purge completion" unless response['success']
      
      items = response['items']
      if items.present?
        @record_ids = @record_ids + response['items'].collect { |item| item['id'] }
        start += rows
      end
    end while items.present?
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
