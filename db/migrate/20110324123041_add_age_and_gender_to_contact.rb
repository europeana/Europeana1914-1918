class AddAgeAndGenderToContact < ActiveRecord::Migration
  def self.up
    add_column 'contacts', 'gender', :string, :limit => 1
    add_column 'contacts', 'age', :string, :limit => 10
  end

  def self.down
    remove_column 'contacts', 'gender'
    remove_column 'contacts', 'age'
  end
end
