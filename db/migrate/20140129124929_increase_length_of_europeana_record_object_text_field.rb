class IncreaseLengthOfEuropeanaRecordObjectTextField < ActiveRecord::Migration
  def self.up
    change_column :europeana_records, :object, :text, :limit => 16777215
  end

  def self.down
    change_column :europeana_records, :object, :text, :limit => 65535
  end
end
