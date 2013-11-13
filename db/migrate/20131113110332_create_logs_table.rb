class CreateLogsTable < ActiveRecord::Migration
  def self.up
    create_table(:logs) do |t|
      t.string :log_type
      t.string :level
      t.text :message
      t.timestamp :timestamp
    end
  end

  def self.down
    drop_table "logs"
  end
end
