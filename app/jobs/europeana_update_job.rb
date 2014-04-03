class EuropeanaUpdateJob

  def perform
    unless EuropeanaRecord.count > 0
      Delayed::Worker.logger.info("EuropeanaUpdateJob: No EuropeanaRecord objects to update.")
      return
    end
    
    @log_file = File.join(Rails.root, 'log', "europeana_update_job-#{Rails.env}.log")
    @last_update_time = get_last_update_time
    @this_update_time = Time.zone.now
    update_records
    log_this_update_time
  end
  
protected

  def get_last_update_time
    if File.exists?(@log_file)
      last_line = IO.readlines(@log_file)[-1].strip
      if last_line.match(/^\d+$/)
        return Time.zone.at(last_line.to_i)
      end
    end
    
    EuropeanaRecord.minimum('updated_at').in_time_zone
  end
  
  def update_records
    start = 1
    rows = 100
    items = nil
    
    begin
      response = get_api_search_results(start, rows)
      raise StandardError, "Europeana API request failed before update completion" unless response['success']
      
      items = response['items']
      if items.present?
        items.each do |item|
          update_record(item['id'])
        end
        start += rows
      end
    end while items.present?
  end
  
  def update_record(record_id)
    record = EuropeanaRecord.find_by_record_id(record_id)
    return if record.nil?
    
    Delayed::Worker.logger.info("Updating EuropeanaRecord with record_id \"#{record_id}\"")
#    record.harvest_object
#    record.save
  end
  
  def log_this_update_time
    File.open(@log_file, 'w+') do |file|
      file.puts(@this_update_time.to_i.to_s)
    end
  end

  def get_api_search_results(start, rows)
    query_string = '("first world war" OR "world war I" OR "1914-1918" NOT europeana_collectionName:"2020601_Ag_ErsterWeltkrieg_EU")'
    query_string << " AND timestamp_update:[#{@last_update_time.iso8601} TO #{@this_update_time.iso8601}]"
    query_options = {
      :start    => start,
      :rows     => rows,
      :profile  => 'standard'
    }
    
    Europeana::API::Search.new(query_string).run(query_options)
  end

end
