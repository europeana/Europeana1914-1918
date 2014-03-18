module Europeana
  module OAI
    class ActiveRecordWrapper < ::OAI::Provider::ActiveRecordWrapper
    protected
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
