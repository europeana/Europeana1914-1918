module Europeana
  module OAI
    class ContributionWrapper < ActiveRecordWrapper
      def initialize(options = {})
        super(ContributionRecord, options)
      end
      
    protected
    
      def find_scope(options)
        return model unless options.key?(:set)

        # Find the set or return an empty scope
        set = find_set_by_spec(options[:set])
        return model.scoped(:limit => 0) if set.nil?
        
        case options[:set]
        when "story"
          model
        when "story:ugc"
          model.scoped.joins(:contributor).where("users.institution_id" => nil)
        when "story:institution"
          model.scoped.joins(:contributor).where("users.institution_id IS NOT NULL")
        when /\Astory:institution:(.*)\Z/
          model.scoped.joins(:contributor => :institution).where("institutions.code" => $1)
        else
          model.scoped(:limit => 0)
        end
      end
    end
  end
end
