# encoding: utf-8
module PaginationHelper
  class << self
    attr_accessor :options
  end
  
  self.options = {
    :first_label        => nil,
    :last_label         => nil,
    :first_title        => nil,
    :previous_title     => nil,
    :next_title         => nil,
    :last_title         => nil,
    :per_page_title     => nil,
    :entry_range_label  => nil,
    :page_total_label   => nil,
    :per_page_label     => nil,
    :page_links         => false,
    :everything_formatted => true,
    :page_form          => true,
    :page_total         => true,
    :entry_range        => true,
    :per_page_list      => true
  }
  
  class LinkRenderer < WillPaginate::ActionView::LinkRenderer
    def pagination
      items = @options[:page_links] ? windowed_page_numbers : []
      if @options[:everything_formatted]
        items.push :everything_formatted
      else
        items.unshift :previous_page
        items.unshift :first_page
        items.unshift :entry_range if @options[:entry_range]
        items.unshift :per_page_list if @options[:per_page_list]
        items.push :page_form if @options[:page_form]
        items.push :page_total if @options[:page_total]
        items.push :next_page
        items.push :last_page
      end
    end
    
  protected
    
    def first_page
      num = @collection.current_page > 1 && 1
      first_or_last_page(num, @options[:first_label], 'nav-first', :title => @options[:first_title])
    end
    
    def previous_page
      num = @collection.current_page > 1 && @collection.current_page - 1
      previous_or_next_page(num, @options[:previous_label], 'nav-prev', :title => @options[:previous_title])
    end

    def next_page
      num = @collection.current_page < @collection.total_pages && @collection.current_page + 1
      previous_or_next_page(num, @options[:next_label], 'nav-next', :title => @options[:next_title])
    end
    
    def last_page
      num = @collection.current_page < total_pages && total_pages
      first_or_last_page(num, @options[:last_label], 'nav-last', :title => @options[:last_title])
    end

    def everything_formatted
      per_page_list + 
      entry_range + 
      tag(:div,
        tag(:ul, 
          [
            first_page,
            previous_page,
            page_form,
            page_total,
            next_page,
            last_page
          ].join( '&nbsp;' * 3 ),
          :class=>"result-pagination"
        ),
        :class => "pagination"
      )
    end
    
    def previous_or_next_page(page, text, classname, options = {})
      if page
        tag(:li, 
          link(CGI::escapeHTML(text), page, options.merge(:class => classname)),
          options.merge(:class => classname)
        )
      else
        tag(:li, text, options.merge(:class => classname + ' disabled'))
      end
    end
    alias_method :first_or_last_page, :previous_or_next_page
    
    def page_form
      tag(:li,
        @template.form_tag({}, { :method => :get, :class => "jump-to-page" }) do
          @template.text_field_tag("page", @collection.current_page, :size => 8) +
          @template.hidden_field_tag("count", @collection.per_page) +
          @template.hidden_field_tag("total_pages", @collection.total_pages)
        end,
        :class => "nav-numbers"
      )
    end
    
    def entry_range
      tag(:div,
        tag(:span, @options[:entry_range_label]), 
        :class => "count"
      )
    end
    
    def page_total
      
      tag(:li,
          tag(:span, @options[:page_total_label], :class => "of-bracket")
        )
    end
    
    def per_page_list
      list_items = [ 12, 24, 48, 96 ].collect do |per_page|
        tag(:li, @template.link_to(per_page, @template.request.params.merge({ :page => 1, :count => per_page }), { :class => per_page } ), :class => "item")
      end
      
      list = tag(:ul, list_items.join, :title => @options[:per_page_title])
      
      labels = '<span class="menu-label">' + @collection.per_page.to_s + '</span><span class="icon-arrow-3"></span>'
     
      wrap = tag(:div, 
        labels + list,
        { 
          :class => "eu-menu",
          :title => @options[:per_page_title],
          "aria-hidden" => "true"
        }
      )
      
      tag(:div, @options[:per_page_label].to_s + wrap, :class => "menu-wrapper")
    end
    
    def container_attributes
      @container_attributes ||= @options.except(*(WillPaginate::ViewHelpers.pagination_options.keys + PaginationHelper.options.keys + [:renderer] - [:class]))
    end
  end
  
  def total_pages
    @collection.total_pages
  end
  
  def will_paginate(collection, options = {})
    return super(collection, options = {}) unless session[:theme] == 'v3'
    
    # early exit if there is nothing to render
    return nil unless collection.total_entries > 0
      
    options = PaginationHelper.options.merge(options)
    
    options[:first_label]       ||= will_paginate_translate([ :first_label, '<<' ])
    options[:previous_label]    ||= will_paginate_translate([ :previous_label, '<' ])
    options[:next_label]        ||= will_paginate_translate([ :next_label, '>' ])
    options[:last_label]        ||= will_paginate_translate([ :last_label, '>>' ])
    options[:entry_range_label] ||= will_paginate_translate([ :entry_range_label, 'Results %{first}–%{last} of %{total}' ], :first => (collection.offset + 1), :last => [ (collection.offset + collection.per_page), collection.total_entries ].min, :total => collection.total_entries)
    options[:page_total_label]  ||= will_paginate_translate([ :page_total_label, 'of %{total_pages}' ], :total_pages => collection.total_pages)
    options[:per_page_label]    ||= will_paginate_translate([ :per_page_label, 'Results per page:' ])
    
    options[:first_title]       ||= will_paginate_translate([ :first_title, 'First page' ])
    options[:previous_title]    ||= will_paginate_translate([ :previous_title, 'Previous page' ])

    options[:next_title]        ||= will_paginate_translate([ :next_title, 'Next page' ])
    options[:last_title]        ||= will_paginate_translate([ :last_title, 'Last page' ])
    options[:per_page_title]    ||= will_paginate_translate([ :per_page_title, 'Number of results shown on the page' ])
        
    unless options[:renderer]
      options = options.merge :renderer => LinkRenderer
    end
    
    options = WillPaginate::ViewHelpers.pagination_options.merge(options)

    options[:previous_label] ||= will_paginate_translate(:previous_label) { '&#8592; Previous' }
    options[:next_label]     ||= will_paginate_translate(:next_label) { 'Next &#8594;' }

    # get the renderer instance
    renderer = case options[:renderer]
    when nil
      raise ArgumentError, ":renderer not specified"
    when String
      klass = if options[:renderer].respond_to? :constantize then options[:renderer].constantize
        else Object.const_get(options[:renderer]) # poor man's constantize
        end
      klass.new
    when Class then options[:renderer].new
    else options[:renderer]
    end
    # render HTML for pagination
    renderer.prepare collection, options, self
    renderer.to_html.html_safe
  end
end
