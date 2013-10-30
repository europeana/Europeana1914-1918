class AddFormatColumnToExportsTable < ActiveRecord::Migration
  def self.up
    add_column :exports, :format, :string, :limit => 20
    
    execute <<-SQL
      UPDATE `exports` 
        SET format='XML' WHERE `file_file_name` LIKE '%.xml.gz';
    SQL
  end

  def self.down
    remove_column :exports
  end
end
