#Encoding.default_external = 'UTF-8'
require 'digest/md5'

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
  
  def europeana_record_url(id)
    dataset_id, record_id = id[1..-1].split('/')
    show_europeana_url(:dataset_id => dataset_id, :record_id => record_id)
  end
  
  ##
  # Gets the oEmbed HTML from an EDM object's edm:isShownBy aggregation
  #
  # Responses from oEmbed providers are cached for 1 day.
  #
  # @param [Hash] Representation of an EDM object
  # @return [String] HTML for the oEmbed resource
  #
  def oembed_html(edmObject)
    if edmObject['aggregations'] && url = edmObject['aggregations'].first['edmIsShownBy']
    
      cache_key = "oembed/response/" + Digest::MD5.hexdigest(url)
      if controller.fragment_exist?(cache_key)
        resource_fields = YAML::load(controller.read_fragment(cache_key))
      elsif provider = OEmbed::Providers.find(url)
        resource = provider.get(url)
        resource_fields = resource.fields
        controller.write_fragment(cache_key, resource_fields.to_yaml, :expires_in => 1.day)
      end
    
      return resource_fields['html'] unless resource_fields.nil?
    end
    ''
  end
end
