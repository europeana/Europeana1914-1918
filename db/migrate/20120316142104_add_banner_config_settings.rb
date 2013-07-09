class AddBannerConfigSettings < ActiveRecord::Migration
  NEW_SETTINGS = [ :banner_active, :banner_text ]
  
  def self.up
    NEW_SETTINGS.each do |name|
      say "Adding #{name.to_s} configuration setting"
      RunCoCo.configuration[name] = RunCoCo::Configuration::DEFAULTS[name]
    end
    say "Saving configuration"
    RunCoCo.configuration.save
  end

  def self.down
    NEW_SETTINGS.each do |name|
      if setting = Setting.find_by_name(name.to_s)
        say "Removing #{name.to_s} setting"
        setting.destroy
      end
    end
  end
end
