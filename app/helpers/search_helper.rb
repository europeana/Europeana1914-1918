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
end
