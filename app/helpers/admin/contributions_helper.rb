module Admin::ContributionsHelper
  def sort_contributions_link(field_name)
    kclass = (field_name == @sort ? "sort sort-active sort-order-#{@order.downcase}" : 'sort')
    
    if [ 'attachments' ].include?(field_name)
      content_tag :span, contribution_field_title(field_name), :class => kclass
    else
      link_dest = url_options.merge({:sort => field_name})
      if field_name == @sort
        reverse_order = (@order.upcase == 'ASC' ? 'DESC' : 'ASC')
        link_dest.merge!(:order => reverse_order)
      end
      link_to contribution_field_title(field_name), link_dest, { :class => kclass }
    end
  end
end
