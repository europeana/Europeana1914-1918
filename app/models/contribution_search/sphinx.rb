module ContributionSearch
  module Sphinx
    def self.included(base)
      base.extend(ClassMethods)
      base.set_search_index
      class << base
        alias_method :sphinx_search, :search
      end
    end
    
    module ClassMethods
      ##
      # Dynamically defines Sphinx search index.
      #
      # MetadataRecord columns equivalent to MetadataField records flagged
      # as searchable will be indexed.
      #
      def set_search_index
        define_index_str = "define_index do\n"
        define_index_str << "  set_property :delta => true\n"
        define_index_str << "  indexes title, :sortable => true\n"
        define_index_str << "  indexes contributor.contact.full_name, :sortable => true, :as => :contributor\n"
        define_index_str << "  has contributor_id\n"
        define_index_str << "  has metadata_record_id\n"
        define_index_str << "  has created_at\n"
        define_index_str << "  has current_status, :as => :status\n"
        define_index_str << "  has status_timestamp\n"

        # Index all searchable taxonomy terms at once, on a single join
        define_index_str << "  indexes metadata.searchable_taxonomy_terms.term, :as => :taxonomy_terms\n"
        define_index_str << "  has metadata.searchable_taxonomy_terms(:id), :as => :taxonomy_term_ids\n"

        fields = MetadataField.where('(searchable = ? OR facet = ?) AND field_type <> ?', true, true, 'taxonomy')
        unless fields.count == 0
          fields.each do |field|
            index_alias = "metadata_#{field.name}"
            indexes_or_has = field.searchable? ? 'indexes' : 'has'
            facet = field.facet? ? 'true' : 'false'
            define_index_str << "  #{indexes_or_has} metadata.#{MetadataRecord.column_name(field.name)}, :sortable => true, :as => :#{index_alias}, :facet => #{facet}\n"
          end
        end
        
        define_index_str << "end\n"
        class_eval(define_index_str, __FILE__, __LINE__)
      end
      
      ##
      # Searches contributions using Sphinx.
      #
      # Always does word-end wildcard queries by appending * to query if not already
      # present.
      #
      # @param (see ContributionSearch::ClassMethods#search)
      # @return (see ContributionSearch::ClassMethods#search)
      #
      def search_sphinx(set, query = nil, options = {})
        unless ThinkingSphinx.sphinx_running?
          raise RunCoCo::SearchOffline
        end
        
        options = options.dup.reverse_merge(:max_matches => ThinkingSphinx::Configuration.instance.client.max_matches)
        
        status_option = if (set == :published)
          { :with => { :status => ContributionStatus.published } }
        else
          { :with => { :status => ContributionStatus.const_get(set.to_s.upcase) } }
        end
        
        options.merge!(status_option)
        
        order = options[:order].present? && [ :desc, :asc ].include?(options[:order].downcase.to_sym) ? options.delete(:order).downcase.to_sym : :asc
        
        if sort = options.delete(:sort)
          if MetadataRecord.taxonomy_associations.include?(sort.to_sym)
            sort_col = nil
          elsif sort =~ /^field_/
            # Convert field name to index alias
            sort_col = sort.sub(/^field_/, 'metadata_')
          else
            sort_col = sort
          end
          
          options[:sort_mode] = order
          options[:order] = sort_col
        else
          if set == :submitted
            options[:order] = 'status_timestamp ASC'
          else
            options[:order] = 'status_timestamp DESC'
          end
        end
        
        contributor_id = options.delete(:contributor_id)
        if contributor_id.present?
          options[:with][:contributor_id] = contributor_id
        end
        
        taxonomy_term = options.delete(:taxonomy_term)
        if taxonomy_term.present?
          options[:with][:taxonomy_term_ids] = taxonomy_term.id
        end
        
        if query.blank?
          Contribution.sphinx_search(options)
        else
          if query.is_a?(Hash)
            query_translations = query.dup
            options[:match_mode] = :extended
            query_translations[I18n.locale] = query_translations[I18n.locale].append_wildcard
            query_translations = query_translations.values.uniq
            query_string = query_translations.add_quote_marks.join(' | ')
          else
            query_string = query.append_wildcard
          end
          Contribution.sphinx_search(query_string, options)
        end
      end
    end
  end
end
