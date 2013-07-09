class CreateSettings < ActiveRecord::Migration
  def self.up
    create_table :settings do |t|
      t.string :name
      t.text :value
      t.datetime :updated_at
    end
    add_index :settings, :name
  end

  def self.down
    drop_table :settings
  end
end
