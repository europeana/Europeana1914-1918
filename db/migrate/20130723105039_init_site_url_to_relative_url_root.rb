class InitSiteUrlToRelativeUrlRoot < ActiveRecord::Migration
  def self.up
    RunCoCo.configuration.site_url = RunCoCo.configuration.relative_url_root
    RunCoCo.configuration.save
  end

  def self.down
    RunCoCo.configuration.site_url = ''
    RunCoCo.configuration.save
  end
end
