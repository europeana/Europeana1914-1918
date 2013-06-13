##
# Modularised search engine support for contributions.
#
# @todo Improve AR fallback when classes cached.
#   The code in app/models/contribution.rb that conditionally includes a 
#   sub-module of ContributionSearch based on the value of 
#   +RunCoCo.configuration.search_engine+ will run on every request in a 
#   development environment, but only on application startup in production, i.e.
#   where +Rails.configuration.cache_classes == true+. If Solr or Sphinx are
#   accessible at application startup, but later become unavailable, the 
#   production environment will not fallback to an ActiveRecord search, but it 
#   should.
#
module ContributionSearch
  autoload :ActiveRecord, 'contribution_search/active_record'
  autoload :Solr,         'contribution_search/solr'
  autoload :Sphinx,       'contribution_search/sphinx'
  
  def self.included(base)
    base.extend(ClassMethods)
  end
  
  module ClassMethods
    ##
    # Search contributions.
    #
    # If query param is +nil+, returns all contributions, unless other search
    # conditions given in options param.
    #
    # @param [Symbol] set Which set of contributions to search. Valid values:
    #   * +:draft+
    #   * +:submitted+
    #   * +:approved+
    #   * +:published+
    #   * +:revised+
    #   * +:rejected+
    #   * +:withdrawn+
    #   ... or +nil+ to search all sets.
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
    # @option options Any other options valid for the search engine in use.
    #
    # @return [Array<Contribution>] Search results
    #
    def search(set, query = nil, options = {}) # :nodoc:
      raise Exception, "#search should be called on one of the sub-modules of ContributionSearch"
    end
    
    def assert_valid_set(set)
      raise ArgumentError, "set should be nil, :draft, :submitted, :approved, :revised, :rejected, :withdrawn or :published, got #{set.inspect}" unless [ nil, :draft, :submitted, :approved, :published, :revised, :rejected, :withdrawn ].include?(set)
      set
    end
  end
end
