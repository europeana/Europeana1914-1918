require 'feedzirra'
require 'hpricot'

module EuropeanaHelper
  
  def nav_links
    links = []
    links << [ t('layout.navigation.contribute'), contributor_dashboard_path ]
    links << [ t('layout.navigation.browse'), page_path('browse') ]
    links << [ t('layout.navigation.about'), page_path('about') ]
    links << [ t('layout.navigation.contact'), page_path('contact') ]
    links << [ t('layout.navigation.help'), page_path('help') ]
    links
  end
  
  def form_previous_step_link(url)
    content_tag 'li', :class => 'back' do
      link_to I18n.t('views.links.previous_step'), url
    end
  end
  
  ##
  # Restores locale to links in
  #   the entry's content with href starting "/", i.e. local absolute links
  #

  def relocale_link(link)
    link.gsub(/href="\//, 'href="/' + I18n.locale.to_s + '/')
  end
  
  ##
  # Removes Blogger elements from HTML
  # 
  # Elements removed:
  # * div.blogger-post-footer
  #
  # @param [String] html HTML to remove Blogger elements from
  # @return [String] HTML with Blogger elements removed
  #
  def deblogger(html)
    html.gsub(/<div class="blogger-post-footer">.*?<\/div>/, '')
  end
  
  ##
  # Retrieves entries from the Europeana 1914-1918 blog via Atom feed
  #
  # An array of {Feedzirra::Parser::AtomEntry} objects is returned. The content
  # attribute of these objects is run through {Hpricot} so can be searched 
  # as an HTML document using its methods.
  #
  # @example Get the first paragraph in an entry
  #   (europeana_blog_posts.first.content/"//p").first
  #
  # @example Get all links in an entry
  #   (europeana_blog_posts.first.content/"//a")
  #
  # @param [Hash] options Options; additional options will be passed to 
  #   {#filter_links}
  # @option options [String] :category The blog category, without the locale.
  #   If not specified, blog entries retrieved will not be filtered by category.
  # @option options [Integer] :expires_in Number of seconds to cache the blog
  #   feed; defaults to 60 minutes. Setting category and locale options results
  #   in independent retrieval and caching of the feed for those options.
  # @option options [String,Symbol] :locale The locale to retrieve blog entries 
  #   for. If none are found for this locale, those from the English blog will 
  #   be returned instead.
  # @return Array<Feedzirra::Parser::AtomEntry> array of feed entries
  # @see #filter_links
  #
  def europeana_blog_posts(options = {})
    url = "http://europeana1914-1918.blogspot.com/feeds/posts/default"
    url = url + "/-/"

    if options[:locale].blank?
      options[:locale] = I18n.locale
    end
    options[:locale] = options[:locale].to_s
    
    if options[:category]
      url = url + options[:category] + '-'
    end
    
    url = url + options[:locale]
    
    if controller.fragment_exist?(url)
      feed = YAML::load(controller.read_fragment(url))
    else
      feed = Feedzirra::Feed.fetch_and_parse(url)
      controller.write_fragment(url, feed.to_yaml,:expires_in => (options[:expires_in] || 60.minutes))
    end
    
    if feed.respond_to?(:entries) && feed.entries.present?
      filter_blog_posts(feed.entries, options.merge(:hpricot => true))
    elsif options[:locale] == 'en'
      []
    else
      europeana_blog_posts(options.merge(:locale => 'en'))
    end
  end
  
  ##
  # Retrieves entries from the Great War Archive blog via Atom feed
  #
  # Unlike {#europeana_blog_posts}, this method does not run the entries'
  # content through Hpricot.
  #
  # @see #europeana_blog_posts
  #
  def gwa_blog_posts(options = {})
    url = "http://thegreatwararchive.blogspot.com/feeds/posts/default"
    url = url + "/-/"

    if options[:locale].blank?
      options[:locale] = I18n.locale
    end
    options[:locale] = options[:locale].to_s
    
    if options[:category].blank? && (options[:locale] == 'de')
      options[:locale] = 'De'
    end
    url = url + options[:locale]
    
    if options[:category]
      url = url + '-' + options[:category]
    end
    
    if controller.fragment_exist?(url)
      feed = YAML::load(controller.read_fragment(url))
    else
      feed = Feedzirra::Feed.fetch_and_parse(url)
      controller.write_fragment(url, feed.to_yaml,:expires_in => (options[:expires_in] || 60.minutes))
    end

    if feed.respond_to?(:entries) && feed.entries.present?
      filter_blog_posts(feed.entries, options.merge(:hpricot => false))
    elsif options[:locale] == 'en'
      []
    else
      gwa_blog_posts(options.merge(:locale => 'en'))
    end
  end
  
#  def blog_post_cache_fragment(options = {})
#    defaults = HashWithIndifferentAccess.new( :blog => 'europeana', :category => 'blog-posts', :locale => I18n.locale )
#    options = options.dup
#    options.reverse_merge!(defaults)
#    
#    blog = options[:blog].sub('-', '_')
#    category = options[:category]
#    locale = options[:locale].to_s
#    
#    "#{blog}_#{category}_#{locale}"
#  end
  
  protected
  ##
  # Filters an array of blog posts according to the supplied options
  # 
  # @param [Array<Feedzirra::Parser::AtomEntry>] Unfiltered array of posts
  # @param [Hash] options Options
  # @option options [Boolean] :deblogger If true, run entry content through
  #   {#deblogger}
  # @options options [Boolean] :hpricot If true, run entry content
  # @option options [Integer] :limit Only return max this number of posts;
  #   default is to return all
  # @option options [Integer] :offset (1) Return posts starting from this 
  #   offset. First post is number 1.
  # @option options [Boolean] :relocale If true, run entry content through
  #   {#relocale_link}
  # @return [Array<Feedzirra::Parser::AtomEntry>] Filtered array of posts
  # @see #deblogger
  # @see #relocale_link
  # @see https://github.com/hpricot/hpricot
  #
  def filter_blog_posts(posts, options = {})
    posts = posts.reject { |entry| entry.blank? }
    posts.each do |entry| 
      if options[:relocale]
        entry.content = relocale_link(entry.content)
      end
      if options[:deblogger]
        entry.content = deblogger(entry.content)
      end
      if options[:hpricot]
        entry.content = Hpricot(entry.content)
      end
    end
    posts = [ posts[((options[:offset] || 1)-1)..-1] ].flatten
    posts = posts[0..((options[:limit] || 0)-1)]
    posts
  end
end
