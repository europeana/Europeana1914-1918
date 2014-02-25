class RemovePasswordSaltColumnFromUsers < ActiveRecord::Migration
  def up
    remove_column "users", "password_salt"
  end

  def down
    add_column "users", "password_salt", "string", :null => false
  end
end
