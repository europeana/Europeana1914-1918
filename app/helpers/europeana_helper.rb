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
  
  def editors_picks(locale = nil)
    url = case locale.to_s
    when 'en'
      "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/en"
    when 'de'
      "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/De"
    else
      default = true
      "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/en"
    end
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries)
      feed.entries
    elsif default
      nil
    else
      editors_pick
    end
  end
  
  def editors_pick(locale)
    (picks = editors_picks(locale)) ? picks.first : nil
  end
  
  def news_items(locale = nil)
    url = case locale.to_s
    when 'en'
      "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/en-news"
    when 'de'
      "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/de-news"
    else
      default = true
      "http://thegreatwararchive.blogspot.com/feeds/posts/default/-/en-news"
    end
    
    feed = Feedzirra::Feed.fetch_and_parse(url)
    if feed.respond_to?(:entries)
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
  
  def form_previous_step_link(url)
    content_tag 'li', :class => 'back' do
      link_to I18n.t('views.links.previous_step'), url
    end
  end
end
