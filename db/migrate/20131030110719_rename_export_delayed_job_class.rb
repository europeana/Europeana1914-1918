class RenameExportDelayedJobClass < ActiveRecord::Migration
  def self.up
    execute <<-SQL
      UPDATE `delayed_jobs` 
        SET handler=REPLACE(handler, '!ruby/object:ExportJob', '!ruby/object:XMLExportJob');
    SQL
  end

  def self.down
    execute <<-SQL
      UPDATE `delayed_jobs` 
        SET handler=REPLACE(handler, '!ruby/object:XMLExportJob', '!ruby/object:ExportJob');
    SQL
  end
end
