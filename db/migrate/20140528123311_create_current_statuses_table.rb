class CreateCurrentStatusesTable < ActiveRecord::Migration
  def up
    create_table(:current_statuses) do |t|
      t.integer   "record_id"
      t.string    "record_type"
      t.string    "name"
      t.timestamps
    end
    add_index "current_statuses", "record_id"
    add_index "current_statuses", "record_type"
    
    RecordStatus.find_each do |rs|
      unless CurrentStatus.where("record_id = ? AND record_type = ? AND updated_at > ?", rs.record_id, rs.record_type, rs.created_at).count > 0
        cs = CurrentStatus.new(:record_id => rs.record_id, :record_type => rs.record_type, :name => rs.name, :created_at => rs.created_at, :updated_at => rs.created_at)
        cs.save!
      end
    end
  end

  def down
    drop_table :current_statuses
  end
end
