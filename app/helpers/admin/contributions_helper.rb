module Admin::ContributionsHelper
  def sort_contributions_link(field_name)
    kclass = (field_name == @sort ? "sort sort-active sort-order-#{@order.downcase}" : 'sort')
    
    if MetadataRecord.taxonomy_associations.include?(field_name.to_sym) || (field_name == 'attachments')
      content_tag :span, contribution_field_title(field_name), :class => kclass
    else
      link_dest = url_options.merge(request.query_parameters).merge({ 'sort' => field_name })
      if field_name == @sort
        reverse_order = (@order.upcase == 'DESC' ? 'ASC' : 'DESC')
        link_dest.merge!('order' => reverse_order)
      else
        link_dest.merge!('order' => 'ASC')
        link_dest.delete('page')
      end
      link_to contribution_field_title(field_name), link_dest, { :class => kclass }
    end
  end
end
