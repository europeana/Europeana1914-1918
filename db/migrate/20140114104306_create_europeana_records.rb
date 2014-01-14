class CreateEuropeanaRecords < ActiveRecord::Migration
  def self.up
    create_table :europeana_records do |table|
      table.string  :record_id  # Europeana portal record ID
      table.text    :object     # YAML representation of full record data
    end
    
    add_index :europeana_records, :record_id, :unique => true
  end

  def self.down
    drop_table :europeana_records
  end
end
