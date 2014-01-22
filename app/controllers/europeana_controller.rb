require 'digest/md5'
require 'will_paginate/collection'

##
# Interface to Europeana API.
#
class EuropeanaController < ApplicationController
  before_filter :europeana_api_configured?
  before_filter :redirect_to_collection_controller, :only => [ :search, :explore ]
  before_filter :redirect_to_search, :only => :search

  # GET /europeana/search
  def search
    @results = []

    if params[:term]
      @term = CGI::unescape(params[:term])
      @field = MetadataField.find_by_name!(params[:field_name])
      if taxonomy_term = @field.taxonomy_terms.find_by_term(@term)
        search_terms = I18n.available_locales.collect do |locale|
          I18n.t("formtastic.labels.taxonomy_term.#{@field.name}.#{@term}", :locale => locale, :default => @term)
        end
      end
    else
      @query = params[:q]
      search_terms = bing_translate(@query)
    end

    if search_terms.present? || params[:term].blank?
      query_params = {
        :page => (params[:page] || 1).to_i,
        :count => [ (params[:count] || 12).to_i, 100 ].min, # Default 12, max 100
        :profile => 'facets',
        :facets => extracted_facet_params
      }
      response = api_search(search_terms, query_params)
      @results = paginate_search_result_items(response, query_params)
      @facets = response['facets']
    end

    if params.delete(:layout) == '0'
      render :partial => '/search/results',
        :locals => {
          :results => @results,
          :query => @query,
          :term => @term
        } and return
    end

    respond_to do |format|
      format.html { render :template => 'search/page' }
      format.json do
        if response.blank?
          json = {}.to_json
        else
          json = response.reject { |key, value| key == "apikey" }.to_json
        end
        json = "#{params[:callback]}(#{json});" unless params[:callback].blank?
        render :json => json
      end
    end
  end

  # GET /europeana/explore/:field_name/:term
  def explore
    search
  end

  # GET /europeana/record/:dataset_id/:record_id
  # @todo Handle errors from Europeana API, e.g. on invalid ID param
  def show
    @object = cached_record(record_id_from_params)

    respond_to do |format|
      format.json  { render :json => { :result => 'success', :object => @object } }
      format.html do
        if params[:edmpdf] == 'true'
          render :partial => 'edm/pdf'
        elsif params[:edmvideo] == 'true'
          render :partial => 'edm/video'
        end
      end
    end
  end
  
  def http_headers
    @object = cached_record(record_id_from_params)

    url = @object['aggregations'].first['edmIsShownBy']
    headers = super(url)

    respond_to do |format|
      format.json do
        render :json => headers
      end
    end
  end
  
  def http_content
    @object = cached_record(record_id_from_params)

    url = @object['aggregations'].first['edmIsShownBy']
    content = super(url)
    
    send_data content.body, :type => content['content-type'], :disposition => content["content-disposition"]
  end

private

  def cached_record(record_id)
    cache_key = "europeana/api/record/" + record_id
    if fragment_exist?(cache_key)
      YAML::load(read_fragment(cache_key))
    elsif (RunCoCo.configuration.search_engine == :solr) && (record = EuropeanaRecord.find_by_record_id("/#{record_id}"))
      record.object
    else
      response = Europeana::API::Record.get(record_id)
      write_fragment(cache_key, response['object'].to_yaml, :expires_in => 1.day)
      response['object']
    end
  end

  def record_id_from_params
    params[:dataset_id] + '/' + params[:record_id]
  end

  ##
  # Prepares and sends a search query to the API.
  #
  # @param [String,Array,Hash] terms One or more term(s) to search for.
  # @param [Hash] options Optional parameters
  # @option options [String,Integer] :count The number of results to return.
  #   Maximum 100; default 12.
  # @option options [String,Integer] :page The page number of results to return.
  #   Default 1.
  # @option options All other options will be passed on to
  #   +Europeana::API::Search#run+
  # @return [Hash] Full response from the API.
  # @see http://www.europeana.eu/portal/api-search-json.html Documentation
  #   of fields in result set.
  #
  def api_search(terms, options = {})
    terms = case terms
    when Hash
      terms.values
    when NilClass
      [ '' ]
    when String
      [ terms ]
    when Array
      terms
    else
      raise ArgumentError, "Unknown terms parameter passed: #{terms.class.to_s}"
    end

    query_options = options.dup

    count = query_options.delete(:count)
    page = query_options.delete(:page)

    quoted_terms = terms.add_quote_marks
    quoted_terms_digest = Digest::MD5.hexdigest(quoted_terms.join(','))
    cache_key = "europeana/api/search/#{quoted_terms_digest}/count#{count.to_s}-page#{page.to_s}"

    if options[:facets].blank? && fragment_exist?(cache_key)
      response = YAML::load(read_fragment(cache_key))
    else
      query_string = build_api_query(terms)
      logger.debug("Europeana query: #{query_string}")

      query_options[:rows] = count
      query_options[:start] = ((page - 1) * count) + 1

      response = Europeana::API::Search.new(query_string).run(query_options)

      # Exclude certain facets from view
      response["facets"].reject! { |facet| [ "REUSABILITY", "UGC" ].include?(facet["name"]) }

      # Add facet data required for view
      response["facets"].each do |facet|
        facet["label"] = t("views.search.facets.common." + facet["name"].downcase, :default => ("views.search.facets.europeana." + facet['name'].downcase).to_sym)
        facet["fields"].each do |field|
          field["search"] = field["label"]
        end
      end

      cache_search_facets("europeana", response["facets"])
      preserve_params_facets("europeana", response["facets"])

      # Fake profile=params API query option not yet in production
      response["params"] ||= {
        "start" => query_options[:start],
        "query" => @query,
        "rows"  => query_options[:rows],
        "profile" => query_options[:profile] + ",params"
      }

      response["items"].each do |item|
        guid_match = /http:\/\/www.europeana.eu\/portal\/record\/([^\/]+)\/([^\/]+)\.html/.match(item["guid"])
        item["guid"] = show_europeana_url(:dataset_id => guid_match[1], :record_id => guid_match[2])
      end

      write_fragment(cache_key, response.to_yaml, :expires_in => 1.day) unless options[:facets].present?
    end

    response

  rescue Europeana::API::Errors::ResponseError
    { 'itemsCount' => 0, 'totalResults' => 0 }
  end

  ##
  # Paginates a set of search result items for use with +will_paginate+
  #
  # @param [Hash] response API search response, with +items+, +itemsCount+ and
  #   +totalResults+ keys, as returned by +#api_search+.
  # @param [Hash] options Optional parameters
  # @option options [String,Integer] :count The number of results to return.
  #   Maximum 100; default 12.
  # @option options [String,Integer] :page The page number of results to return.
  #   Default 1.
  # @return [WillPaginate::Collection] +will_paginate+ compatibile result set.
  #
  def paginate_search_result_items(response, options)
    WillPaginate::Collection.create(options[:page], options[:count], response['totalResults']) do |pager|
      if response['itemsCount'] == 0
        pager.replace([])
      else
        pager.replace(response['items'])
      end
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

  def redirect_to_search
    if params[:provider] && params[:provider] != self.controller_name
      params.delete(:qf)
      params[:controller] = params[:provider]
      redirect_required = true
    end

    params.delete(:provider)

    redirect_to params if redirect_required
  end
end
