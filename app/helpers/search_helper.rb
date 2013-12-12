module SearchHelper
  def link_to_facet_row(facet_name, row_value, row_label = nil, multiple = true, active_class = false)
    row_label ||= row_value

    request_params  = request.query_parameters.dup
    facet_params    = request_params.has_key?(:qf) ? request_params[:qf].dup : []
    row_param_value = "#{facet_name.to_s}:#{row_value.to_s}"
    
    if multiple
      if !facet_row_selected?(facet_name, row_value)
        facet_params << row_param_value
      end
    else
      index = facet_params.index { |fp| fp.match(/^#{facet_name.to_s}:/).present? }
      facet_params.delete_at(index) unless index.nil?
      facet_params << row_param_value
    end
    
    facet_row_url = url_for(request_params.merge(:page => 1, :qf => facet_params))
    
    if active_class
      link_to "<label class=\"bold\">#{row_label}</label>".html_safe, facet_row_url, :class => 'bold', 'data-value' => "&qf[]=#{row_param_value}" 
    else
      link_to "<label>#{row_label}</label>".html_safe, facet_row_url, 'data-value' => "&qf[]=#{row_param_value}" 
    end
  end
  
  def facet_row_selected?(facet_name, row_value)
    !facet_row_index(facet_name, row_value).nil?
  end
  
  def facet_row_index(facet_name, row_value)
    params = request.query_parameters
    if params[:qf].present?
      params[:qf].index { |fp| fp.match(/^#{facet_name.to_s}:#{row_value.to_s}/).present? }
    else
      nil
    end
  end
  
  def facet_is_single_select?(facet_name)
    controller.controller_name == "trove" && facet_name == "zone"
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
    if result.respond_to?(:id)
      result.id
    elsif result.is_a?(Enumerable) && result.has_key?('id')
      result['id']
    else
      raise ArgumentError, "Unable to retrieve search result ID from #{result.class}"
    end
  end
  
  def search_result_to_edm(result)
    case controller.controller_name
    when 'contributions'
      result.edm.as_result
    else
      result
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
  
  # @param [String] query The text query searched for
  # @param [Array<Hash>] facets Array of all facets available to this view
  def links_for_selected_filters(query, facets)
    filter_params = []
    
    if params[:term]
      filter_params << { :name => "term", :value => params[:term] }
    end
    
    request.query_string.split('&').each do |param|
      param_parts = param.split('=')
      param_name  = CGI::unescape(param_parts.first)
      param_value = CGI::unescape(param_parts.last)
      if param_name == "q" || param_name == "qf[]"
        filter_params << { :name => param_name, :value => param_value }
      end
    end
    
    filter_links = []
    
    filter_params.each_with_index do |filter_param, index|
      link_params = request.query_parameters.dup
      link_params.delete(:q)
      link_params.delete(:qf)
      
      if filter_param[:name] == "term"
        link_text = CGI::unescape(filter_param[:value])
        remove_url = url_for(link_params.merge(:action => :search, :term => nil, :field => nil))
      elsif filter_param[:name] == "q"
        link_text = query
        remove_url = url_for(link_params.merge(request.query_parameters[:qf].present? ? { :qf => request.query_parameters[:qf] } : {}))
        
        data_val_remove  = "&q=#{query}"
        data_val  = "&q=#{query}"
      else
        facet_row_parts = filter_param[:value].match(/^([^:]+):(.+)$/)
        facet_name, field_value = facet_row_parts[1], facet_row_parts[2]
        facet = facets.find { |facet| facet["name"].to_s == facet_name }
        link_text = facet["label"] + ": " + facet["fields"].find { |field| field["search"].to_s == field_value }["label"]
        remove_url = remove_facet_row_url_options(facet_name, field_value)
        
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
          :url  => url_for(remove_url)
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

