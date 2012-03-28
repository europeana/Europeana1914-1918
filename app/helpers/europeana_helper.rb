require 'feedzirra'

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
  
  def editors_picks(locale = nil)
    if locale.nil?
      default = true
      url = "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/en"
    elsif locale.to_s == 'de'
      url = "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/De"
    else
      url = "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/#{locale.to_s}"
    end
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries) && feed.entries.present?
      feed.entries
    elsif default
      []
    else
      editors_picks
    end
  end
  
  def editors_pick(locale)
    (picks = editors_picks(locale)) ? picks.first : nil
  end
  
  def news_items(locale = nil)
    if locale.nil?
      default = true
      url = "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/en-news"
    else
      url = "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/#{locale.to_s}-news"
    end
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries) && feed.entries.present?
      feed.entries
    elsif default
      nil
    else
      news_items
    end
  end
  
  def news_item(locale)
    (items = news_items(locale)) ? items.first : nil
  end
  
  def stories_from_the_archive(locale = nil)
    if locale.nil?
      default = true
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/stories-from-the-archive-en"
    else
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/#{locale.to_s}"
    end
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries) && feed.entries.present?
      feed.entries
    elsif default
      []
    else
      stories_from_the_archive
    end
  end
  
  def tell_us_your_story(locale = nil)
    if locale.nil?
      default = true
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/tell-us-your-story-en"
    else
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/#{locale.to_s}"
    end
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries) && feed.entries.present?
      feed.entries
    elsif default
      []
    else
      tell_us_your_story
    end
  end
  
  def collection_days(locale = nil)
    if locale.nil?
      default = true
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/collection-days-en"
    else
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/#{locale.to_s}"
    end
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries) && feed.entries.present?
      feed.entries
    elsif default
      []
    else
      collection_days
    end
  end
  
  def relocale_link(link)
    link.sub(/href="\//, 'href="/' + I18n.locale.to_s + '/')
  end
  
  def explore_by_theme(locale = nil)
    if locale.nil?
      default = true
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/explore-by-theme-en"
    else
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/#{locale.to_s}"
    end
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries) && feed.entries.present?
      feed.entries
    elsif default
      []
    else
      explore_by_theme
    end
  end
  
  def explore_by_object(locale = nil)
    if locale.nil?
      default = true
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/explore-by-object-en"
    else
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/#{locale.to_s}"
    end
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries) && feed.entries.present?
      feed.entries
    elsif default
      []
    else
      explore_by_object
    end
  end
  
  def explore_introduction(locale = nil)
    if locale.nil?
      default = true
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/explore-introduction-en"
    else
      url = "http://europeana1914-1918.blogspot.com/feeds/posts/default/-/#{locale.to_s}"
    end
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries) && feed.entries.present?
      feed.entries
    elsif default
      []
    else
      explore_introduction
    end
  end
  
end
