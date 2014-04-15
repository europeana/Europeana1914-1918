module Europeana
  class UpdateJob

    def perform
      unless EuropeanaRecord.count > 0
        Delayed::Worker.logger.info("Europeana::UpdateJob: No EuropeanaRecord objects to update.")
        return
      end
      
      Delayed::Worker.logger.info("Europeana::UpdateJob: Updating EuropeanaRecords...")
      
      @log_file = File.join(Rails.root, 'log', "europeana_update_job-#{Rails.env}.log")
      @last_update_time = get_last_update_time
      @this_update_time = Time.zone.now
      
      ::ActiveRecord::Base.cache do
        update_records
      end
      
      log_this_update_time
    end
    
  protected

    def get_last_update_time
      if File.exists?(@log_file)
        last_line = IO.readlines(@log_file)[-1]
        if last_line.present?
          last_line.strip!
          if last_line.match(/^\d+$/)
            return Time.zone.at(last_line.to_i)
          end
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
        unless response['success']
          Delayed::Worker.logger.info("Europeana::UpdateJob: Europeana API request failed before update completion")
          raise StandardError, "Europeana API request failed before update completion"
        end
        
        items = response['items']
        if items.present?
          items.each do |item|
            if record_needs_update?(item['id'], item['timestamp_update_epoch'].to_i / 1000)
              update_record(item['id'])
            end
          end
          start += rows
        end
      end while items.present?
    end
    
    def update_record(record_id)
      record = EuropeanaRecord.find_by_record_id(record_id)
      return if record.nil?
      
      Delayed::Worker.logger.debug("Europeana::UpdateJob: Updating EuropeanaRecord with record_id \"#{record_id}\"")
      record.harvest_object
      record.save
      Sunspot.commit
    end
    
    def record_needs_update?(record_id, updated_at)
      record = EuropeanaRecord.find_by_record_id(record_id)
      return false if record.nil?
      
      # Temporary workaround for discrepancy between timestamps returned by
      # Europeana API on search results and records
      return true
      
      record.updated_at.to_i < updated_at
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
end
