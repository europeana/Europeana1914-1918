class Setting < ActiveRecord::Base
  serialize :value

  validates_presence_of :name
  validates_uniqueness_of :name
  validates_inclusion_of :name, :in => CoCoCo::Configuration::DEFAULTS.keys.map { |name| name.to_s }  
end
