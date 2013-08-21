class CreateInstitution < ActiveRecord::Migration
  def self.up
    create_table "institutions" do |t|
      t.string :code, :null => false
      t.string :name, :null => false
    end
    
    add_index "institutions", :code, :unique => true
  end

  def self.down
    drop_table "institutions"
  end
end
