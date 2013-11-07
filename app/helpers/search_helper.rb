module SearchHelper
  def link_to_facet_row(facet_name, row_value, row_label = nil, multiple = true)
    row_label ||= row_value
    facets_param = request.query_parameters.has_key?(:facets) ? request.query_parameters[:facets].dup : {}
    if multiple && !facet_row_selected?(facet_name, row_value)
      facets_param[facet_name] ||= []
      facets_param[facet_name] << row_value.to_s #facets_param[facet_name].to_s + "," + row_value.to_s
    else
      facets_param[facet_name] = row_value.to_s
    end
    
    link_to row_label, request.query_parameters.merge(:page => 1, :facets => facets_param)
  end
  
  def facet_row_selected?(facet_name, row_value)
    params = request.query_parameters
    params[:facets].present? && [ params[:facets][facet_name] ].flatten.include?(row_value.to_s)
  end
  
  def facet_is_single_select?(facet_name)
    controller.controller_name == "trove" && facet_name == "zone"
  end
  
  def remove_facet_row_url_options(facet_name, row_value)
    return request.query_parameters unless params.has_key?(:facets)
    
    facet_params = request.query_parameters[:facets].dup
    
    facet_params[facet_name] = facet_params[facet_name].reject! { |row| row == row_value.to_s }
    facet_params.delete(facet_name) unless facet_params[facet_name].present?
    
    request.query_parameters.merge({ :facets => facet_params })
  end
  
  def link_to_search_provider(id)
    url_options = request.parameters.merge(:page => 1, :controller => id)
    url_options.delete(:facets)
    link_to search_provider_name(id), url_options
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
