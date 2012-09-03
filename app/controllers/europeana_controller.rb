require 'digest/md5'

##
# Interface to Europeana OpenSearch API.
#
class EuropeanaController < ApplicationController
  before_filter :europeana_api_configured?

  # GET /europeana/search
  def search
    @query = params[:q]
    @results = query_api(bing_translate_query(@query), params[:page] || 1).for_pagination
    
    if params.delete(:layout) == '0'
      render :partial => 'search-results',
        :locals => {
          :results => @results,
          :query => @query,
          :term => @term
        } and return
    end
  end
  
  # GET /europeana/explore/:field_name/:term
  def explore
    @term = CGI::unescape(params[:term])
    @results = []
    
    @field = MetadataField.find_by_name!(params[:field_name])
    if taxonomy_term = @field.taxonomy_terms.find_by_term(@term)
      term_translations = I18n.available_locales.collect do |locale|
        I18n.t("formtastic.labels.taxonomy_term.#{@field.name}.#{@term}", :locale => locale)
      end
      @results = query_api(term_translations, params[:page] || 1).for_pagination
    end
    
    if params.delete(:layout) == '0'
      render :partial => 'search-results',
        :locals => {
          :results => @results,
          :query => @query,
          :term => @term
        } and return
    end
    
    render :action => 'search'
  end
  
  private
  ##
  # Sends a query off to the API.
  #
  # @param [String,Array] terms One or more term(s) to search for.
  # @param [Integer,String] page The page of results to retrieve.
  # @return [Array<Europeana::Search::ResultSet>] Search results.
  #
  def query_api(terms, page = 1)
    quoted_terms_digest = Digest::MD5.hexdigest(quote_terms(terms).join(','))
    cache_key = "europeana/#{quoted_terms_digest}/page#{page.to_s}"
    
    if fragment_exist?(cache_key)
      results = YAML::load(read_fragment(cache_key))
    else
      query_string = build_api_query(terms)
      logger.debug("Europeana query: #{query_string}")
      results = Europeana::Search::Query.new(query_string).run(:page => page)
      write_fragment(cache_key, results.to_yaml, :expires_in => 1.day)
    end
    
    results
  end
  
  ##
  # Constructs the query to send to the API.
  #
  # @param [String,Array] terms One or more term(s) to search for.
  # @return [String] The query string to send to the API as the searchTerms 
  #   parameter.
  #
  def build_api_query(terms)
    qualifiers = '"first world war" NOT europeana_collectionName: "2020601_Ag_ErsterWeltkrieg_EU"'
    
    if terms.blank?
      qualifiers
    else
      quoted_terms = quote_terms(terms)
      
      joined_terms = if quoted_terms.size == 1
        quoted_terms.first
      else
        '(' + quoted_terms.join(' OR ') + ')'
      end
  
      joined_terms + ' AND ' + qualifiers
    end
  end
end
