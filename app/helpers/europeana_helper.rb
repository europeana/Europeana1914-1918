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
  
  def relocale_link(link)
    link.sub(/href="\//, 'href="/' + I18n.locale.to_s + '/')
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
  # @param [Hash] options Options
  # @option options [String] :category The blog category, without the locale.
  #   If not specified, blog entries retrieved will not be filtered by category.
  # @option options [String,Symbol] :locale The locale to retrieve blog entries 
  #   for. If none are found for this locale, those from the English blog will 
  #   be returned instead.
  # @option options [Boolean] :relocale if true, restore locale to links in
  #   the entry's content with href starting "/", i.e. local absolute links
  # @return Array<Feedzirra::Parser::AtomEntry> array of feed entries
  # @see relocale_link()
  # @see https://github.com/hpricot/hpricot
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
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries) && feed.entries.present?
      feed.entries.each do |entry| 
        if options[:relocale]
          entry.content = relocale_link(entry.content)
        end
        entry.content = Hpricot(entry.content)
      end
      feed.entries
    elsif options[:locale] == 'en'
      []
    else
      europeana_blog_posts(options.merge(:locale => 'en'))
    end
  end
  
  ##
  # Retrieves entries from the Great War Archive blog via Atom feed
  #
  # Unlike {europeana_blog_posts()}, this method does not run the entries'
  # content through Hpricot.
  #
  # @see europeana_blog_posts()
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
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries) && feed.entries.present?
      feed.entries.each do |entry| 
        if options[:relocale]
          entry.content = relocale_link(entry.content)
        end
      end
      feed.entries.reject { |entry| entry.blank? }
    elsif options[:locale] == 'en'
      []
    else
      gwa_blog_posts(options.merge(:locale => 'en'))
    end
  end
end
