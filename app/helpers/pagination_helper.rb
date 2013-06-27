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
    :page_form          => true,
    :page_total         => true,
    :entry_range        => true,
    :per_page_list      => true
  }
  
  class LinkRenderer < WillPaginate::ActionView::LinkRenderer
    def pagination
      items = @options[:page_links] ? windowed_page_numbers : []
      items.unshift :previous_page
      items.unshift :first_page
      items.unshift :entry_range if @options[:entry_range]
      items.unshift :per_page_list if @options[:per_page_list]
      items.push :page_form if @options[:page_form]
      items.push :page_total if @options[:page_total]
      items.push :next_page
      items.push :last_page
    end
    
  protected
    
    def first_page
      num = @collection.current_page > 1 && 1
      first_or_last_page(num, @options[:first_label], 'first_page', :title => @options[:first_title])
    end
    
    def previous_page
      num = @collection.current_page > 1 && @collection.current_page - 1
      previous_or_next_page(num, @options[:previous_label], 'previous_page', :title => @options[:previous_title])
    end

    def next_page
      num = @collection.current_page < @collection.total_pages && @collection.current_page + 1
      previous_or_next_page(num, @options[:next_label], 'next_page', :title => @options[:next_title])
    end
    
    def last_page
      num = @collection.current_page < total_pages && total_pages
      first_or_last_page(num, @options[:last_label], 'last_page', :title => @options[:last_title])
    end
    
    def previous_or_next_page(page, text, classname, options = {})
      if page
        link(CGI::escapeHTML(text), page, options.merge(:class => classname))
      else
        tag(:span, text, options.merge(:class => classname + ' disabled'))
      end
    end
    alias_method :first_or_last_page, :previous_or_next_page
    
    def page_form
      @template.form_tag({}, { :method => :get, :class => "pagination" }) do
        @template.text_field_tag("page", @collection.current_page, :size => 8) +
        @template.hidden_field_tag("count", @collection.per_page)
      end
    end
    
    def entry_range
      tag(:span, @options[:entry_range_label], :class => "entry-range")
    end
    
    def page_total
      tag(:span, @options[:page_total_label], :class => "page-total")
    end
    
    def per_page_list
      list_items = [ 12, 24, 48, 96 ].collect do |per_page|
        tag(:li, @template.link_to(per_page, :page => 1, :count => per_page))
      end
      
      list = tag(:ul, list_items.join, :title => @options[:per_page_title])
      
      tag(:div, @options[:per_page_label].to_s + list, :class => "entries-per-page")
    end
    
    def container_attributes
      @container_attributes ||= @options.except(*(WillPaginate::ViewHelpers.pagination_options.keys + PaginationHelper.options.keys + [:renderer] - [:class]))
    end
  end
  
  def will_paginate(collection, options = {})
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
    
    super(collection, options)
  end
end
