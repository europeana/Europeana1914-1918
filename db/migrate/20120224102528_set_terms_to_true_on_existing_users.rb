class SetTermsToTrueOnExistingUsers < ActiveRecord::Migration
  def self.up
    say_with_time "Accepting terms on all existing contributor accounts" do
      User.where(:role_name => 'contributor').find_each do |contributor|
        contributor.update_attribute('terms', true)
      end
    end
  end

  def self.down
    say_with_time "Un-accepting terms on all existing contributor accounts" do
      User.where(:role_name => 'contributor').find_each do |contributor|
        contributor.update_attribute('terms', false)
      end
    end
  end
end
