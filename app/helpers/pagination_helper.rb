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
    :entry_range_label  => nil,
    :page_total_label   => nil,
    :page_links         => false,
    :page_form          => true,
    :page_total         => true,
    :entry_range        => true
  }
  
  class LinkRenderer < WillPaginate::ActionView::LinkRenderer
    def pagination
      items = @options[:page_links] ? windowed_page_numbers : []
      items.push :page_form if @options[:page_form]
      items.push :page_total if @options[:page_total]
      items.unshift :previous_page
      items.unshift :first_page
      items.unshift :entry_range if @options[:entry_range]
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
      form_fields = [
        empty_tag(:input, :type => "text", :name => "page", :value => @collection.current_page, :size => 8),
        empty_tag(:input, :type => "hidden", :name => "count", :value => @collection.per_page),
      ]
      
      tag(:form, form_fields.join, :method => :get, :class => "pagination")
    end
    
    def entry_range
      tag(:span, @options[:entry_range_label], :class => 'entry-range')
    end
    
    def page_total
      tag(:span, @options[:page_total_label], :class => 'page-total')
    end
    
    def container_attributes
      @container_attributes ||= @options.except(*(WillPaginate::ViewHelpers.pagination_options.keys + PaginationHelper.options.keys + [:renderer] - [:class]))
    end
    
    def empty_tag(name, attributes = {})
      string_attributes = attributes.inject('') do |attrs, pair|
        unless pair.last.nil?
          attrs << %( #{pair.first}="#{CGI::escapeHTML(pair.last.to_s)}")
        end
        attrs
      end
      "<#{name}#{string_attributes} />"
    end
  end
  
  def will_paginate(collection, options = {})
    options = PaginationHelper.options.merge(options)
    
    options[:first_label]       ||= will_paginate_translate([ :first_label, '<<' ])
    options[:previous_label]    ||= will_paginate_translate([ :previous_label, '<' ])
    options[:next_label]        ||= will_paginate_translate([ :next_label, '>' ])
    options[:last_label]        ||= will_paginate_translate([ :last_label, '>>' ])
    options[:entry_range_label] ||= will_paginate_translate([ :entry_range_label, 'Results %{first}–%{last} of %{total}' ], :first => (collection.offset + 1), :last => [ (collection.offset + collection.per_page + 1), collection.total_entries ].min, :total => collection.total_entries)
    options[:page_total_label]  ||= will_paginate_translate([ :page_total_label, 'of %{total_pages}' ], :total_pages => collection.total_pages)
    
    options[:first_title]    ||= will_paginate_translate([ :first_title, 'First page' ])
    options[:previous_title] ||= will_paginate_translate([ :previous_title, 'Previous page' ])
    options[:next_title]     ||= will_paginate_translate([ :next_title, 'Next page' ])
    options[:last_title]     ||= will_paginate_translate([ :last_title, 'Last page' ])
    
    unless options[:renderer]
      options = options.merge :renderer => LinkRenderer
    end
    
    super(collection, options)
  end
end
