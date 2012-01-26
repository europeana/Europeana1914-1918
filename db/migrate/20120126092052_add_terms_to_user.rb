class AddTermsToUser < ActiveRecord::Migration
  def self.up
    add_column 'users', 'terms', :boolean, :null => true, :default => nil
    User.where(:role_name => 'contributor').find_each do |contributor|
      contributor.update_attribute('terms', true)
    end
  end

  def self.down
    remove_column 'users', 'terms'
  end
end
