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
end
