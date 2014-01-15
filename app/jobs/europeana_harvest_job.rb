class EuropeanaHarvestJob
  def perform
    # 1. Search API with WWI, non 1914-1918 query terms, 100 rows per page
    harvest_all
    
    # 2. Iterate over each page, retrieving each item from the API
    # 3. Store the result as a EuropeanaRecord
    # 4. Send an email on completion?
  end
  
private

  def harvest_all
    page = 1
    while page.present?
      results = harvest_page(page)
      page = results.next_page
    end
  end

  def harvest_page(page)
    results = get_api_search_results(page)
    Rails.logger.debug("Harvesting Europeana API results page #{page} of #{results.total_pages}")
    results.each do |result|
      record_id = result['id']
      create_record(record_id)
    end
    results
  end

  def paginate_search_result_items(response, options)
    WillPaginate::Collection.create(options[:page], options[:per_page], response['totalResults']) do |pager|
      if response['itemsCount'] == 0
        pager.replace([])
      else
        pager.replace(response['items'])
      end
    end
  end

  def get_api_search_results(page)
    per_page = 100
    query_string = '"first world war" NOT europeana_collectionName: "2020601_Ag_ErsterWeltkrieg_EU"'
    query_options = {
      :start    => ((page - 1) * per_page) + 1,
      :rows     => per_page,
      :profile  => 'minimal'
    }
    
    response = Europeana::API::Search.new(query_string).run(query_options)
    paginate_search_result_items(response, { :page => page, :per_page => per_page })
  end
  
  def get_api_record(record_id)
    response = Europeana::API::Record.get(record_id)
    response['object']
  end
  
  def create_record(record_id)
    record = EuropeanaRecord.find_or_initialize_by_record_id(record_id)
    if record.new_record?
      record.object = get_api_record(record_id)
      record.save
    end
  end

end
