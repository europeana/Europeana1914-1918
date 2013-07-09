class RemoveUniqueConstraintFromUserEmail < ActiveRecord::Migration
  def self.up
    remove_index :users, :name => "index_users_on_email"
    add_index "users", ["email"], :name => "index_users_on_email"
  end

  def self.down
    remove_index :users, :name => "index_users_on_email"
    add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  end
end
