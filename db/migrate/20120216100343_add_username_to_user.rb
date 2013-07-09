class AddUsernameToUser < ActiveRecord::Migration
  class User < ActiveRecord::Base
  end

  def self.up
    add_column "users", "username", :string, :null => false
    say_with_time 'Initialising usernames to email addresses' do
      User.find_each do |user|
        user.update_attribute(:username, user.email)
      end
    end
    add_index "users", ["username"], :unique => true
  end

  def self.down
    remove_column "users", "username"
  end
end
