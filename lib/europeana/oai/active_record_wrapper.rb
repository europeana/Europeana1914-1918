module Europeana
  module OAI
    class ActiveRecordWrapper < ::OAI::Provider::ActiveRecordWrapper
      protected
      def find_scope(options)
        return model
      end
    end
  end
end
