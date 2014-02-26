module SearchHelper
  ##
  # Returns true if the HTTP referrer is one of the collection or federated
  # search URLs.
  #
  # @return [Boolean]
  #
  def referred_by_search?
    return false unless controller.request.env["HTTP_REFERER"].present?
    referer = URI.parse(controller.request.env["HTTP_REFERER"])
    referer.path.match(/\/(search|explore)([?\/]|$)/).present?
  end
  
  def link_to_facet_row(facet_name, row_value, row_label = nil, multiple = true, html_options = {})
    row_label ||= row_value

    request_params  = request.query_parameters.dup
    facet_params    = request_params.has_key?(:qf) ? request_params[:qf].dup : []
    row_param_value = "#{facet_name.to_s}:#{row_value.to_s}"
    html_options['data-value'] ||= "&qf[]=#{row_param_value}"

    if controller.controller_name == "collection" && facet_name == "index"
      facet_params = [ row_param_value ]
    elsif multiple
      if !facet_row_selected?(facet_name, row_value)
        facet_params << row_param_value
      end
    else
      index = facet_params.index { |fp| fp.match('^' + Regexp.quote(facet_name.to_s) + ':').present? }
      facet_params.delete_at(index) unless index.nil?
      facet_params << row_param_value
    end
    
    facet_row_url = url_for(request_params.merge(:page => 1, :qf => facet_params))
    
    link_to row_label, facet_row_url, html_options
  end
  
  def facet_row_selected?(facet_name, row_value)
    !facet_row_index(facet_name, row_value).nil?
  end
  
  def facet_row_index(facet_name, row_value)
    params = request.query_parameters
    if params[:qf].present?
      params[:qf].index { |fp| fp.match('^' + Regexp.quote(facet_name.to_s) + ':' + Regexp.quote(row_value.to_s)).present? }
    else
      nil
    end
  end
  
  def facet_is_single_select?(facet_name)
    singles = [
      [ "collection", "index" ],
      [ "trove", "zone" ]
    ]
    singles.find { |single| controller.controller_name == single.first && facet_name == single.last }
  end
  
  def remove_facet_row_url_options(facet_name, row_value)
    params = request.query_parameters.dup
    index = facet_row_index(facet_name, row_value)
    return params if index.nil?
    
    facet_params = params.delete(:qf)
    facet_params.delete_at(index)
    params[:qf] = facet_params unless facet_params.blank?
    
    params
  end
  
  def link_to_remove_facet_row(facet_name, row_value, row_label = nil, html_options = {})
    row_label ||= row_value
    row_param_value = "#{facet_name.to_s}:#{row_value.to_s}"
    html_options['data-value'] ||= "&qf[]=#{row_param_value}"
    
    link_to row_label, remove_facet_row_url_options(facet_name, row_value), html_options
  end
  
  def registered_search_providers
    if RunCoCo.configuration.search_engine == :solr
      [ '/collection', '/federated_search/digitalnz', '/federated_search/dpla', '/federated_search/trove' ]
    else
      [ '/contributions', '/europeana', '/federated_search/digitalnz', '/federated_search/dpla', '/federated_search/trove' ]
    end
  end
  
  def search_result_to_edm(result)
    if result.is_a?(Contribution) || result.is_a?(EuropeanaRecord)
      cached_edm_result(result)
    else
      result
    end
  end
  
  def cached_edm_result(result)
    return result unless result.is_a?(Contribution) || result.is_a?(EuropeanaRecord)
    
    cache_key = "#{result.class.to_s.underscore.pluralize}/edm/result/#{result.id}"
    
    if controller.fragment_exist?(cache_key)
      edm = YAML::load(controller.read_fragment(cache_key))
    else
      if result.is_a?(Contribution)
        edm = result.edm.as_result
      else
        edm = result.to_edm_result
        id_parts = edm['id'].split('/')
        edm['guid'] = show_europeana_url(:dataset_id => id_parts[1], :record_id => id_parts[2])
      end

      controller.write_fragment(cache_key, edm.to_yaml)
    end
    
    edm
  end
  
  def link_to_search_provider(id)
    url_options = request.parameters.merge(:page => 1, :controller => id)
    url_options.delete(:qf)     # Facets differ between providers
    url_options.delete(:field)  # Used to restrict search to one field on Contribution Solr index
    url_options.delete(:zone)   # Trove zone
    link_to search_provider_name(id), url_options
  rescue ActionController::RoutingError
    nil
  end
  
  def search_provider_href(id)
    url_options = request.parameters.merge(:page => 1, :controller => id)
    url_options.delete(:qf)
    url_for(url_options)
  rescue ActionController::RoutingError
    nil
  end
  
  def search_provider_name(id)
    provider = id.split('/').last
    t(provider, :scope => "views.search.providers", :default => provider)
  end
  
  def search_provider_stem(id)
    id.split("/").last
  end
  
  def current_search_provider_stem
    controller.controller_name
  end
  
  def search_result_id(result)
    if result.is_a?(Contribution)
      result.id
    elsif result.is_a?(EuropeanaRecord)
      result.record_id
    elsif result.is_a?(Enumerable) && result.has_key?('id')
      result['id']
    else
      raise ArgumentError, "Unable to retrieve search result ID from #{result.class}"
    end
  end
  
  def search_result_fragment_key(result)
    "#{session[:theme]}/#{I18n.locale}/search/result/#{controller.controller_name}/" + no_leading_slash(search_result_id(result).to_s)
  end
  
  def search_result_preview(record)
    if record['edmPreview'].blank? || record['edmPreview'].first.blank?
      if controller.controller_name == 'contributions'
        image_tag(contribution_media_type_image_path(record['id']), :alt => "")
      else
        image_tag("style/icons/mimetypes/unknown.png", :alt => t("media_types.unknown"))
      end
    else
      image_tag(record['edmPreview'].first, :alt => "")
    end
  end
  
  def search_filters_present?
    params[:q].present? || params[:qf].present? || (params[:field].present? && params[:term].present?)
  end
  
  def back_to_search_link
    back_url = url_for(:back)
    if params[:anchor]
      back_url << "#" << CGI.escape(params[:anchor])
    end
    link_to( t('views.links.back-to-search'), back_url) 
  end
  
  # @param [String] query The text query searched for
  # @param [Array<Hash>] facets Array of all facets available to this view
  def links_for_selected_filters(query, facets)
    filter_params = []
    
    if params[:term]
      filter_params << { :name => "term", :value => params[:term] }
    end
    
    request.query_string.split('&').each do |param|
      param_parts = param.split('=')
      param_name  = CGI::unescape(param_parts[0])
      param_value = CGI::unescape(param_parts[1]) unless param_parts[1].nil?
            
      if controller.controller_name == "collection" && param_name == "qf[]" && param_value.match(/^index:/)
        filter_params.unshift( { :name => param_name, :value => param_value } ) unless param_value.blank?
      elsif param_name == "q" || param_name == "qf[]"
        filter_params << { :name => param_name, :value => param_value } unless param_value.blank?
      end
    end
    
    filter_links = []
    
    filter_params.each_with_index do |filter_param, index|
      link_params = request.query_parameters.dup
      link_params.delete(:q)
      link_params.delete(:qf)
      
      if filter_param[:name] == "term"
        link_text = CGI::unescape(filter_param[:value])
        remove_url = url_for(link_params.merge(:action => :search, :term => nil, :field => nil, :qf => request.query_parameters[:qf]))
      elsif filter_param[:name] == "q"
        link_text = query
        remove_url = url_for(link_params.merge(request.query_parameters[:qf].present? ? { :qf => request.query_parameters[:qf] } : {}))
        
        data_val_remove = "&q=#{query}"
        data_val = "&q=#{query}"
      else
        facet_row_parts = filter_param[:value].match(/^([^:]+):(.+)$/)
        facet_name, field_value = facet_row_parts[1], facet_row_parts[2]
        
        if facet_name == "q" # Refine your search
          link_text = field_value
        else
          facet = facets.find { |facet| facet["name"].to_s == facet_name }

          # Hack for facets in query but not in search response, req'd in dev env
          # where caching is disabled
          # @todo Replace with a solution that preserves facet info without
          #   depending on caching being enabled
          next unless facet.present?

          if controller.controller_name == "collection" && facet["label"] == 'Source'
             facet["label"] = t('views.search.facets.europeana.source_label')
          end
          
          link_text = facet["label"] + ": " + facet["fields"].find { |field| field["search"].to_s == field_value }["label"]
        end
        
        if facet_is_single_select?(facet_name)
          remove_url = nil
        else
          remove_url = url_for(remove_facet_row_url_options(facet_name, field_value))
        end
        
        data_val_remove = "&qf[]=#{facet_name.to_s}:#{field_value.to_s}"
        data_index = index.to_s
      end
      
      filter_params[0..index].each do |previous_param|
        if previous_param[:name] == "q"
          link_params[:q] = previous_param[:value]
        else
          link_params[:qf] ||= []
          link_params[:qf] << previous_param[:value]
        
          data_val ||= ''
          data_val += '&' + previous_param[:name] + '=' + previous_param[:value]
        end
      end

      
      
      filter_links << {
        :reduce => {
          :text => link_text,
          :url  => url_for(link_params)
        },
        :remove => {
          :url  => remove_url
        },
        :data => {
          :val_remove  => data_val_remove,
          :val => data_val
        }
      }
    end

    filter_links
  end
end

