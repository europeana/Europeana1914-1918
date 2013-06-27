module PaginationHelper
  class << self
    attr_accessor :options
  end
  
  self.options = {
    :first_label    => nil,
    :last_label     => nil,
  }
  
  class LinkRenderer < WillPaginate::ActionView::LinkRenderer
    def pagination
      items = super
      items.unshift :first_page
      items.push :last_page
    end
    
    protected
    
    alias_method :first_or_last_page, :previous_or_next_page
    
    def first_page
      num = @collection.current_page > 1 && 1
      first_or_last_page(num, @options[:first_label], 'first_page')
    end
      
    def last_page
      num = @collection.current_page < total_pages && total_pages
      first_or_last_page(num, @options[:last_label], 'last_page')
    end
    
  end
  
  def will_paginate(collection, options = {})
    options = PaginationHelper.options.merge(options)
    
    options[:first_label]    ||= will_paginate_translate([ :first_label, '&lt;&lt;' ])
    options[:last_label]     ||= will_paginate_translate([ :last_label, '&gt;&gt;' ])
    
    unless options[:renderer]
      options = options.merge :renderer => LinkRenderer
    end
    
    super(collection, options)
  end
end
