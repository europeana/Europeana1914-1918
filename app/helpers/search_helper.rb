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
  
  def link_to_facet_row(facet_name, row_value, row_label = nil, html_options = {})
    row_label ||= row_value
    row_value = row_value.to_s
    facet_name = facet_name.to_s

    query_string = request.query_string.dup
    query_string.sub!(/(?<=\A|\?|&)page=[^\Z&]*/, 'page=1')
    html_options['data-value'] ||= "&qf[#{facet_name}][]=#{row_value}"

    if facet_name == 'index' && controller.controller_name == 'collection'
      # Switching index, so remove all facets
      query_string.gsub!(/(\A|&)qf%5B.*?%5D(%5B%5D)?=[^\Z&]*/, '')
      query_string.gsub!(/(\A|&)qf\[.*?\](\[\])?=[^\Z&]*/, '')
      query_string << '&' << CGI.escape("qf[#{facet_name}]") << '=' << CGI.escape(row_value)
    elsif facet_is_single_select?(facet_name)
      query_string.gsub!(/(\A|&)qf%5B#{facet_name}%5D(%5B%5D)?=[^\Z&]*/, '')
      query_string.gsub!(/(\A|&)qf\[#{facet_name}\](\[\])?=[^\Z&]*/, '')
      query_string << '&' << CGI.escape("qf[#{facet_name}]") << '=' << CGI.escape(row_value)
    elsif !facet_row_selected?(facet_name, row_value)
      query_string << '&' << CGI.escape("qf[#{facet_name}][]") << '=' << CGI.escape(row_value)
    end
    
    query_string.sub!(/\A&/, '')
    
    facet_row_url = url_for().sub(/\?.*\Z/, '') + '?' + query_string
    
    link_to row_label, facet_row_url, html_options
  end
  
  def facet_row_selected?(facet_name, row_value)
    if request.query_parameters[:qf].present? && request.query_parameters[:qf][facet_name].present?
      facet_param = request.query_parameters[:qf][facet_name]
      case facet_param
      when String
        facet_param == row_value
      when Array
        !facet_param.find_index(row_value).nil?
      else
        false
      end
    else
      false
    end
  end
  
  def facet_is_single_select?(facet_name)
    singles = [
      [ "collection", "index" ],
      [ "trove", "zone" ]
    ]
    singles.find { |single| controller.controller_name == single.first && facet_name == single.last }
  end
  
  def remove_facet_row_url(facet_name, row_value)
    url_for().sub(/\?.*\Z/, '') + '?' + remove_facet_row_query_string(facet_name, row_value)
  end
  
  def remove_facet_row_query_string(facet_name, row_value)
    request.query_string.sub(/(\A|&)qf%5B#{facet_name}%5D(%5B%5D)?=[^\Z&]*/, '').sub(/(\A|&)qf\[#{facet_name}\](\[\])?=[^\Z&]*/, '')
  end
  
  def link_to_remove_facet_row(facet_name, row_value, row_label = nil, html_options = {})
    row_label ||= row_value
    row_value = row_value.to_s
    facet_name = facet_name.to_s
    html_options['data-value'] ||= "&qf[#{facet_name}][]=#{row_value}"
    
    link_to row_label, remove_facet_row_url(facet_name, row_value), html_options
  end
  
  def registered_search_providers
    if RunCoCo.configuration.search_engine == :solr
      providers = [ '/collection' ]
    else
      providers = [ '/contributions', '/europeana' ]
    end
    providers + [ '/federated_search/digitalnz', '/federated_search/dpla', '/federated_search/canadiana' ]
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
    params[:q].present? || params[:qf].present? || params[:term].present?
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
      
      if controller.controller_name == "collection" && param_name.match(/\Aqf\[index\]/)
        filter_params.unshift( { :name => param_name, :value => param_value } ) unless param_value.blank?
      elsif param_name == "q" || param_name.match(/\Aqf\[[^\]]+\]/)
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
        form_field = hidden_field_tag('q', filter_param[:value], :id => nil)
        
        data_val_remove = "&q=#{query}"
        data_val = "&q=#{query}"
      else
        facet_row_parts = filter_param[:name].match(/\Aqf\[([^\]]+)\](\[\])?\Z/)
        facet_name = facet_row_parts[1]
        facet_multiple = facet_row_parts[2].present? # @todo Needed?
        field_value = filter_param[:value]
        form_field = hidden_field_tag(filter_param[:name], field_value, :id => nil)
        
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
          
          if facet_field = facet["fields"].find { |field| field["search"].to_s == field_value }
            link_text = facet["label"] + ": " + facet_field["label"]
          else
            link_text = field_value
          end
        end
        
        if facet_is_single_select?(facet_name)
          remove_url = nil
          data_val_remove = "&qf[#{facet_name.to_s}]=#{field_value.to_s}"
        else
          remove_url = url_for(remove_facet_row_url(facet_name, field_value))
          data_val_remove = "&qf[#{facet_name.to_s}][]=#{field_value.to_s}"
        end
        
        data_index = index.to_s
      end
      
      data_val = ''
      reduce_query_string = filter_params[0..index].collect do |previous_param|
        data_val += '&' + previous_param[:name] + '=' + previous_param[:value]
        CGI.escape(previous_param[:name]) + '=' + CGI.escape(previous_param[:value])
      end.join('&')
      reduce_url = url_for().sub(/\?.*\Z/, '') + '?' + reduce_query_string

      filter_links << {
        :reduce => {
          :text => link_text,
          :url  => reduce_url
        },
        :remove => {
          :url  => remove_url
        },
        :data => {
          :val_remove  => data_val_remove,
          :val => data_val
        },
        :form => {
          :field => form_field
        }
      }
    end

    filter_links
  end
end

