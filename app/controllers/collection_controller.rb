# @todo Restrict to published contributions
class CollectionController < SearchController
  before_filter :require_solr!
  
  # GET /collection/search
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
      if search_terms.is_a?(Hash)
        search_terms = search_terms.dup.values.uniq.add_quote_marks.join(' ')
      end
    end
    
    if search_terms.present? || params[:term].blank?
      pagination_params = {
        :page => (params[:page] || 1).to_i,
        :per_page => [ (params[:count] || 48).to_i, 100 ].min # Default 48, max 100
      }
      
      indices = case extracted_facet_params[:index].first
        when "a"
          [ Contribution, EuropeanaRecord ]
        when "c"
          Contribution
        when "e"
          EuropeanaRecord
      end
      
      search = Sunspot.search indices do |query|
        facet_params = extracted_facet_params.dup
        facet_params.delete(:index)
        facet_params.each_pair do |name, criteria|
          query.with(name.to_sym).all_of(criteria)
        end
        
        query.with :current_status, ContributionStatus.published
        
        if indices == Contribution
          # Contribution facets
          MetadataField.where(:facet => true, :field_type => 'taxonomy').each do |field|
            query.facet "metadata_#{field.name}_ids"
          end
          query.facet "place_name"
        elsif indices == EuropeanaRecord
          # EuropeanaRecord facets
          query.facet "year"
          query.facet "type"
          query.facet "provider"
          query.facet "data_provider"
          query.facet "country"
          query.facet "rights"
        end
        
        query.fulltext search_terms, { :minimum_match => 1 } # Equivalent to Boolean OR in dismax query mode
        query.paginate(pagination_params.dup)
      end
      
      edm_results = search.results.collect do |result|
        if result.is_a?(EuropeanaRecord)
          edm = result.to_edm_result
          id_parts = edm['id'].split('/')
          edm['guid'] = show_europeana_url(:dataset_id => id_parts[1], :record_id => id_parts[2])
          edm
        else
          result.edm.as_result
        end
      end
      
      @facets = [ index_facet ] + search.facets.collect { |facet|
        {
          "name" => facet.name.to_s,
          "label" => facet_label(facet.name),
          "fields" => facet.rows.collect { |row|
            {
              "label" => facet_row_label(facet.name, row.value),
              "search" => row.value.to_s,
              "count" => row.count
            }
          }
        }
      }
      
      response = {
        'facets' => @facets,
        'items' => edm_results,
        'itemsCount' => search.results.size,
        'totalResults' => search.total
      }

      @results = paginate_search_result_items(response, pagination_params)
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
          json = response.to_json
        end
        json = "#{params[:callback]}(#{json});" unless params[:callback].blank?
        render :json => json
      end
    end
  end
  
  # GET /collection/explore/:field_name/:term
  def explore
    search
  end
  
private

  ##
  # Paginates a set of search result items for use with +will_paginate+
  #
  # @param [Hash] response API search response, with +items+, +itemsCount+ and
  #   +totalResults+ keys, as returned by +#api_search+.
  # @param [Hash] options Optional parameters
  # @option options [String,Integer] :per_page The number of results to return.
  #   Maximum 100; default 48.
  # @option options [String,Integer] :page The page number of results to return.
  #   Default 1.
  # @return [WillPaginate::Collection] +will_paginate+ compatibile result set.
  # @todo Is this necessary when the source is a paginated Sunspot search?
  #
  def paginate_search_result_items(response, options)
    WillPaginate::Collection.create(options[:page], 
    options[:per_page], 
    response['totalResults']) do |pager|
      if response['itemsCount'] == 0
        pager.replace([])
      else
        pager.replace(response['items'])
      end
    end
  end
  
  def facet_label(facet_name)
    if taxonomy_field_facet = facet_name.to_s.match(/^metadata_(.+)_ids$/)
      field_name = taxonomy_field_facet[1]
    else
      field_name = facet_name
    end
    
    provider = case extracted_facet_params[:index].first
      when "c"
        "contributions"
      when "e"
        "europeana"
    end
    #t("views.search.facets.#{provider}.#{field_name}", :default => "views.search.facets.common.#{field_name}".to_sym)
    provider + '(p)-> ' + t("views.search.facets.#{provider}.#{field_name}", :default => "views.search.facets.common.#{field_name}".to_sym)
  end
  
  def facet_row_label(facet_name, row_value)
    @@metadata_fields ||= {}
    
    if row_value.is_a?(Integer)
      if taxonomy_field_facet = facet_name.to_s.match(/^metadata_(.+)_ids$/)
        field_name = taxonomy_field_facet[1]
        unless @@metadata_fields[field_name]
          @@metadata_fields[field_name] = MetadataField.includes(:taxonomy_terms).find_by_name(field_name)
        end
        if row_term = @@metadata_fields[field_name].taxonomy_terms.select { |term| term.id == row_value }.first
          row_label = row_term.term
        end
      end
    end
    row_label || row_value.to_s
  end
  
  def redirect_to_search
    index = extracted_facet_params[:index]

    # Validate index:
    # * is present
    # * has only one value
    # * is a known value
    unless index.present? && (index.size == 1) && [ "a", "c", "e" ].include?(index.first)
      facet_params = extracted_facet_params
      facet_params[:index] = [ "a" ]
      params[:qf] = compile_facet_params(facet_params)
      @redirect_required = true
    end
    
    super
  end
  
  def require_solr!
    unless RunCoCo.configuration.search_engine == :solr
      redirect_to search_contributions_path
    end
  end
  
  ##
  # Constructs a pseudo-facet for the index to be searched
  #
  # @return [Hash]
  # @todo Move labels into locale
  #
  def index_facet
    {
      "name" => "index",
      "label" => "Source",
      "fields" => [ 
        { "search" => "a", "label" => t('views.search.facets.europeana.source_all') },
        { "search" => "c", "label" => t('views.search.facets.europeana.source_ugc') },
        { "search" => "e", "label" => t('views.search.facets.europeana.source_institution')}
      ]
    }
  end
end
