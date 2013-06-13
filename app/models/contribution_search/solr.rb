module ContributionSearch
  module Solr
    def self.included(base)
      base.class_eval do
        include ContributionSearch
        include ContributionSearch::ActiveRecord
        
        # Set up the Solr index
        searchable do
          text    :title
          text    :contributor do
            contributor.contact.full_name
          end
          
          integer :contributor_id
          integer :metadata_record_id
          integer :current_status
          
          time    :created_at
          time    :status_timestamp
          
          # Index all searchable taxonomy terms at once
          text    :taxonomy_terms do
            metadata.searchable_taxonomy_terms.collect { |t| t.term }
          end
          integer :taxonomy_term_ids, :multiple => true do
            metadata.searchable_taxonomy_terms.collect { |t| t.id }
          end
          
          # Index other searchable fields individually
          fields = MetadataField.where('(searchable = ? OR facet = ?) AND field_type <> ?', true, true, 'taxonomy')
          unless fields.count == 0
            fields.each do |field|
              text "metadata_#{field.name}" do
                metadata.send(MetadataRecord.column_name(field.name))
              end
            end
          end
        end
        
        base.extend(ClassMethods)
      end
    end
    
    module ClassMethods
      ##
      # Run a search against Solr index
      #
      # Search against contribution titles and any metadata fields flagged as
      # searchable.
      #
      # @param (see ContributionSearch::ClassMethods#search)
      # @return (see ContributionSearch::ClassMethods#search)
      # @todo Configurable max matches
      #
      def search(set, query = nil, options = {})
        assert_valid_set(set)
        
        solr_options = options.dup
        
        sunspot_search = solr_search do
          unless set.nil?
            if (set == :published)
              with :current_status, ContributionStatus.published
            else
              with :current_status, ContributionStatus.const_get(set.to_s.upcase)
            end
          end
          
          contributor_id = solr_options.delete(:contributor_id)
          if contributor_id.present?
            with :contributor_id, contributor_id
          end
          
          taxonomy_term = solr_options.delete(:taxonomy_term)
          if taxonomy_term.present?
            with :taxonomy_term_ids, taxonomy_term.id
          end
          
          order = solr_options.delete(:order)
          if order.present? 
            order = order.downcase.to_sym
            order = :asc unless [ :desc, :asc ].include?(order)
          end
        
          if sort = solr_options.delete(:sort)
            if MetadataRecord.taxonomy_associations.include?(sort.to_sym)
              sort_col = nil
            elsif sort =~ /^field_/
              # Convert field name to index alias
              sort_col = sort.sub(/^field_/, 'metadata_')
            else
              sort_col = sort
            end
            
            order_by(sort_col.to_sym, order) unless sort_col.nil?
          else
            if set == :submitted
              order_by(:status_timestamp, :asc)
            else
              order_by(:status_timestamp, :desc)
            end
          end
          
          paginate(:page => solr_options[:page], :per_page => solr_options[:per_page])
          
          unless query.blank?
            if query.is_a?(Hash)
              query_string = query.dup.values.uniq.add_quote_marks.join(' ')
            else
              query_string = query
            end
            fulltext query_string, { :minimum_match => 1 } # Equivalent to Boolean OR in dismax query mode
          end
        end
        
        case sunspot_search
        when Sunspot::Search::StandardSearch
          sunspot_search.results
        when Sunspot::Search::PaginatedCollection
          sunspot_search
        else
          raise Exception, "Don't know how to handle Sunspot results class #{sunspot_search.class.to_s}"
        end
        
      rescue Errno::ECONNREFUSED
        RunCoCo.error_logger.warn('Solr not accessible; falling back to ActiveRecord search.')
        active_record_search(set, query, options)
      end
      
      ##
      # Tests if Solr server is accessible by attempting a query to it.
      #
      # The test query is against an integer attribute (current_status), and
      # would always return 0 results.
      #
      # @return [Boolean]
      #
      def solr_accessible?
        solr_search do
          with :current_status, -1
        end
        true
      rescue Errno::ECONNREFUSED
        false
      end
    end
  end
end
