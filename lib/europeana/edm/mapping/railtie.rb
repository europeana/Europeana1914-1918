require 'rails'
require 'europeana'

module Europeana::EDM::Mapping
  class Railtie < Rails::Railtie
    initializer 'europeana_edm_mapping.insert_into_active_record' do
      ActiveSupport.on_load :active_record do
        if defined?(ActiveRecord)
          ActiveRecord::Base.send(:include, Europeana::EDM::Mapping)
        end
      end
    end
  end
end
