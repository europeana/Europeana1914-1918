class AssociateUserWithInstitution < ActiveRecord::Migration
  def self.up
    add_column "users", "institution_id", :integer
    add_index "users", "institution_id"
  end

  def self.down
    remove_column "users", "institution_id"
  end
end
