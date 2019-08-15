module Europeana
  module OAI
    class ContributionWrapper < ::OAI::Provider::ActiveRecordWrapper
      def initialize(options = {})
        super(ContributionRecord, options)
      end
    end
  end
end
