class AddTypeFieldToContact < ActiveRecord::Migration
  def self.up
    add_column :contacts, :type, :string, :limit => 32
    execute("UPDATE contacts SET type='Contact' WHERE id IN (SELECT contact_id FROM users)")
    execute("UPDATE contacts SET type='Guest' WHERE type IS NULL")
  end

  def self.down
    remove_column :contacts, :type
  end
end
