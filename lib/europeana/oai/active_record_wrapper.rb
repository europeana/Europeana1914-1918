module Europeana
  module OAI
    class ActiveRecordWrapper < ::OAI::Provider::ActiveRecordWrapper
    protected
      def find_scope(options)
        return model unless model.ancestors.include?(Contribution)
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
      
      def sql_conditions(opts)
        sql = []
        esc_values = {}
        if opts.has_key?(:from)
          sql << "#{model.table_name}.#{timestamp_field} >= :from"
          esc_values[:from] = parse_to_local(opts[:from])
        end
        if opts.has_key?(:until)
          # Handle databases which store fractions of a second by rounding up
          sql << "#{model.table_name}.#{timestamp_field} < :until"
          esc_values[:until] = parse_to_local(opts[:until]) { |t| t + 1 }
        end
        return [sql.join(" AND "), esc_values]
      end
    end
  end
end
