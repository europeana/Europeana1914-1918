require 'digest/md5'
require 'will_paginate/collection'

##
# Interface to Europeana API.
#
class EuropeanaController < ApplicationController
  before_filter :europeana_api_configured?

  # GET /europeana/search
  def search
    @query = params[:q]
    @results = query_api(bing_translate(@query), :page => params[:page], :count => params[:count])
    
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
        I18n.t("formtastic.labels.taxonomy_term.#{@field.name}.#{@term}", :locale => locale, :default => @term)
      end
      @results = query_api(term_translations, :page => params[:page], :count => params[:count])
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
  
  # GET /europeana/record/:dataset_id/:record_id
  # @todo Cache API responses
  # @todo Handle errors from Europeana API, e.g. on invalid ID param
  def show
    europeana_id = '/' + params[:dataset_id] + '/' + params[:record_id]
    response = Europeana::API::Record.get(europeana_id)
    @record = response['object']
    
    respond_to do |format|
      format.json  { render :json => { :result => 'success', :object => @record } } 
      format.html
    end
  end
  
  private
  ##
  # Sends a query off to the API.
  #
  # @param [String,Array,Hash] terms One or more term(s) to search for.
  # @param [Hash] options Optional parameters
  # @option options [String,Integer] :count The number of results to return.
  #   Maximum 100; default 48.
  # @option options [String,Integer] :page The page number of results to return.
  #   Default 1.
  # @return [WillPaginate::Collection] will_paginate compatibile result set.
  # @see http://www.europeana.eu/portal/api-search-json.html Documentation 
  #   of fields in result set.
  #
  def query_api(terms, options = {})
    terms = case terms
    when Hash
      terms.values
    when String
      [ terms ]
    when Array
      terms
    else
      raise ArgumentError, "Unknown terms parameter passed: #{terms.class.to_s}"
    end
    
    options[:count] = [ (options[:count] || 48).to_i, 100 ].min
    options[:page] = (options[:page] || 1).to_i
    
    quoted_terms = terms.add_quote_marks
    quoted_terms_digest = Digest::MD5.hexdigest(quoted_terms.join(','))
    cache_key = "europeana/#{quoted_terms_digest}/count#{options[:count].to_s}-page#{options[:page].to_s}"
    
    if fragment_exist?(cache_key)
      results = YAML::load(read_fragment(cache_key))
    else
      query_string = build_api_query(terms)
      logger.debug("Europeana query: #{query_string}")
      
      query_options = {}
      query_options[:rows] = options[:count]
      query_options[:start] = (((options[:page] || 1).to_i - 1) * options[:count]) + 1
      
      results = Europeana::API::Search.new(query_string).run(query_options)
      
      write_fragment(cache_key, results.to_yaml, :expires_in => 1.day)
    end
    
    WillPaginate::Collection.create(options[:page], results['itemsCount'], results['totalResults']) do |pager|
      pager.replace(results['itemsCount'] == 0 ? [] : results['items'])
    end
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
      quoted_terms = terms.add_quote_marks
      
      joined_terms = if quoted_terms.size == 1
        quoted_terms.first
      else
        '(' + quoted_terms.join(' OR ') + ')'
      end
  
      joined_terms + ' AND ' + qualifiers
    end
  end
end
