##
# Modularised, engine-agnostic contribution search.
#
module ContributionSearch
  autoload :ActiveRecord, 'contribution_search/active_record'
  autoload :Sphinx,       'contribution_search/sphinx'
  
  def self.included(base)
    base.class_eval do
      include ContributionSearch::ActiveRecord
      if ThinkingSphinx.sphinx_running?
        include ContributionSearch::Sphinx
      end
    end
    base.extend(ClassMethods)
  end
  
  module ClassMethods
    ##
    # Search contributions.
    #
    # Uses ThinkingSphinx if available. If not, falls back to a simple
    # non-indexed SQL query.
    #
    # With ThinkingSphinx, this will search against contribution titles and
    # any metadata fields flagged as searchable. The SQL fallback will only 
    # search the contribution titles. 
    #
    # If query param is +nil+, returns all contributions, unless other search
    # conditions given in options param.
    #
    # @param [Symbol] set Which set of contributions to search. Valid values:
    #   * +:approved+
    #   * +:submitted+
    #   * +:published+
    #   * +:draft+
    #   * +:rejected+
    #
    # @param [String] query The full-text query to pass to the search engine.
    #   Defaults to +nil+, returning all contributions in the named set.
    #
    # @param [Hash] options Search options
    # @option options [Integer,String] :contributor_id Only return results from
    #   the contributor with this ID.
    # @option options [TaxonomyTerm] :taxonomy_term Only return results
    #   categorised with this taxonomy term.
    # @option options [Integer,String] :page Number of page of results to return.
    # @option options [Integer,String] :per_page Number of results to return per 
    #   page.
    # @option options [String] :order Direction to order the results: 'ASC' or 
    #   'DESC'. Default is 'ASC' provided +sort+ param also present, otherwise
    #   set-specific.
    # @option options [String] :sort Column to sort on, e.g. 'created_at'. 
    #   Default is set-specific.
    # @option options Any other options valid for ThinkingSphinx or ActiveRecord 
    #   queries.
    #
    # @return [Array<Contribution>] Search results
    #
    # @see http://freelancing-god.github.com/ts/en/searching.html ThinkingSphinx 
    #   search options
    #
    def search(set, query = nil, options = {})
      raise ArgumentError, "set should be :draft, :submitted, :approved, :revised, :rejected, :withdrawn or :published, got #{set.inspect}" unless [ :draft, :submitted, :approved, :published, :revised, :rejected, :withdrawn ].include?(set)
      
      if ThinkingSphinx.sphinx_running?
        sphinx_search(set, query, options)
      else
        activerecord_search(set, query, options)
      end
    end
  end
end
