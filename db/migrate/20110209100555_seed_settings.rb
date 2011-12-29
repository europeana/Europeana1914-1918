class SeedSettings < ActiveRecord::Migration
  def self.up
    CoCoCo.configuration.save
  end

  def self.down
    Setting.destroy_all
  end
end
