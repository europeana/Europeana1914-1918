##
# Interface to Europeana OpenSearch API.
#
class EuropeanaController < ApplicationController
  before_filter :europeana_api_configured?

  # GET /europeana/search
  def search
    @query = params[:q]
    
    if @query.present? && bing_translator_configured?
      translator = BingTranslator.new(RunCoCo.configuration.bing_client_id, RunCoCo.configuration.bing_client_secret)
      other_locales = I18n.available_locales.reject { |locale| locale == I18n.locale }
      query_translations = [ @query ] + other_locales.collect do |locale|
        translator.translate @query, :to => locale
      end
      europeana_query = build_api_query(query_translations)
    else
      europeana_query = build_api_query(@query)
    end
    
    logger.debug("Europeana query: #{europeana_query}")
    @results = Europeana::Search::Query.new(europeana_query).paginate(:page => params[:page])
    
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
      europeana_query = build_api_query(term_translations)
      logger.debug("Europeana query: #{europeana_query}")
      @results = Europeana::Search::Query.new(europeana_query).paginate(:page => params[:page])
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
      quoted_terms = [terms].flatten.uniq.collect do |term|
        # Enclose each term in quotes if multiple words
        term.match(/ /).blank? ? term : ('"' + term + '"')
      end
      
      joined_terms = if quoted_terms.size == 1
        quoted_terms.first
      else
        '(' + quoted_terms.join(' OR ') + ')'
      end
  
      joined_terms + ' AND ' + qualifiers
    end
  end
end
