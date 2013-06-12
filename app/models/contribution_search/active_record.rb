module ContributionSearch
  module ActiveRecord
    def self.included(base)
      base.extend(ClassMethods)
    end
    
    module ClassMethods
      ##
      # Simple text query against contributions.
      #
      # Intended for use as:
      # - a backup if no other engine is available
      # - a lightweight alternative when queries are only on indexed attributes, 
      #   i.e. not full text
      #
      # @param (see ContributionSearch::ClassMethods#search)
      # @return (see ContributionSearch::ClassMethods#search)
      #
      def search_active_record(set, query = nil, options = {})
        options = options.dup
        
        set_where = if set.nil?
          1
        elsif set == :published
          [ 'current_status=?', ContributionStatus.published ]
        else
          [ 'current_status=?', ContributionStatus.const_get(set.to_s.upcase) ]
        end
        
        query_where = if query.blank?
          nil
        elsif query.is_a?(Hash)
          query_translations = query.dup
          query_translations[I18n.locale] = query_translations[I18n.locale].add_quote_marks('%')
          query_translations = query_translations.values.uniq
          [ query_translations.collect { |qt| 'title LIKE ?' }.join(' OR ') ] + query_translations
        else
          [ 'title LIKE ?', query.add_quote_marks('%') ]
        end
        
        metadata_joins = []
        joins = [ ]
        if (sort = options.delete(:sort)).present?
          if MetadataRecord.taxonomy_associations.include?(sort.to_sym)
            sort_col = "taxonomy_terms.term"
            metadata_joins << sort.to_sym
          elsif sort == 'contributor'
            sort_col = "contacts.full_name"
            joins << { :contributor => :contact }
          else
            sort_col = sort
          end

          order = options.delete(:order)
          order = (order.present? && [ 'DESC', 'ASC' ].include?(order.upcase)) ? order : 'ASC'
          
          sort_order = "#{sort_col} #{order}"
        else
          if set == :submitted
            options[:order] = 'status_timestamp ASC'
          else
            options[:order] = 'status_timestamp DESC'
          end
        end
        
        contributor_id = options.delete(:contributor_id)
        contributor_where = contributor_id.present? ? { :contributor_id => contributor_id } : nil
        
        taxonomy_term = options.delete(:taxonomy_term)
        if taxonomy_term.present?
          taxonomy_field_alias = taxonomy_term.metadata_field.collection_id
          metadata_joins << taxonomy_field_alias
          if sort_col == "taxonomy_terms.term"
            taxonomy_term_where = { "#{taxonomy_field_alias}.id" => taxonomy_term.id }
          else
            taxonomy_term_where = { "taxonomy_terms.id" => taxonomy_term.id }
          end
        else
          taxonomy_term_where = nil
        end
        
        joins << { :metadata => metadata_joins }
        
        results = joins(joins).where(set_where).where(query_where).where(contributor_where).where(taxonomy_term_where).order(sort_order)
          
        if options.has_key?(:page)
          results = results.paginate(options)
        end
        
        results
      end
    end
  end
end
