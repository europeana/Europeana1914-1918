module PaginationHelper
  class << self
    attr_accessor :options
  end
  
  self.options = {
    :first_label    => nil,
    :last_label     => nil,
    :first_title    => nil,
    :previous_title => nil,
    :next_title     => nil,
    :last_title     => nil,
  }
  
  class LinkRenderer < WillPaginate::ActionView::LinkRenderer
    def pagination
      items = super
      items.unshift :first_page
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
        link(text, page, options.merge(:class => classname))
      else
        tag(:span, text, options.merge(:class => classname + ' disabled'))
      end
    end
    alias_method :first_or_last_page, :previous_or_next_page
    
  end
  
  def will_paginate(collection, options = {})
    options = PaginationHelper.options.merge(options)
    
    options[:first_label]    ||= will_paginate_translate([ :first_label, '&lt;&lt;' ])
    options[:previous_label] ||= will_paginate_translate([ :previous_label, '&lt;' ])
    options[:next_label]     ||= will_paginate_translate([ :next_label, '&lt;' ])
    options[:last_label]     ||= will_paginate_translate([ :last_label, '&gt;&gt;' ])
    
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
