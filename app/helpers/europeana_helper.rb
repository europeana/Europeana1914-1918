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
  # Selects an appropriate value for display of an EDM proxy object field
  #
  # Returns:
  # * a localised version for the user's locale if it exists; or
  # * the first non-empty "def" value if present; or
  # * all non-empty values joined.
  #
  # @param [Hash] proxy Proxy object from an EDM record
  # @param [String] field_name Name of the field to retrieve
  # @return [String] Value to display for the field
  #
  def edm_proxy_field(proxy, field_name)
    return nil unless proxy.respond_to?(:has_key?) && proxy.has_key?(field_name)

    if proxy[field_name].is_a?(String)
      proxy[field_name]
    elsif proxy[field_name].has_key?(I18n.locale.to_s)
      proxy[field_name][I18n.locale.to_s].first
    elsif proxy[field_name].has_key?("def") 
      proxy[field_name]["def"].reject(&:blank?).first
    else
      proxy[field_name].values.reject(&:blank?).join(',')
    end
  end
  
  ##
  # Returns the first latitude, longitude pair found in an array of EDM places
  #
  # @param [Array<Hash>] places Array of places data from EDM record
  # @return [String] lat,lng
  #
  def edm_places_latlng(places)
    return nil unless places.respond_to?(:each)
    places.each do |place|
      if place.has_key?("latitude") && place.has_key?("longitude")
        return [ place["latitude"], place["longitude"] ].join(",")
      end
    end
  end
  
  ##
  # Gets the URL path to display an EDM record on this site.
  #
  # @param [String] record_guid guid field of the EDM record
  # @return [String] Local URL path
  #
  def local_edm_record_path(record_guid)
    if guid_match = /http:\/\/www.europeana.eu\/portal\/record\/([^\/]+)\/([^\/]+)\.html/.match(record_guid)
      show_europeana_path(:dataset_id => guid_match[1], :record_id => guid_match[2])
    elsif guid_match = /\/contributions\/(\d+)$/.match(record_guid)
      contribution_path(:id => guid_match[1])
    else
      record_guid
    end
  end
  
  ##
  # Gets the oEmbed HTML from an EDM object's edm:isShownBy aggregation
  #
  # Responses from oEmbed providers are cached for 1 day.
  #
  # @param [Hash] Representation of an EDM object
  # @return [String] HTML for the oEmbed resource
  #
  def oembed_html(edm_object)
    # Fake SoundCloud aggregation
    # TODO: Remove this!
    if edm_object['type'] == 'SOUND'
      edm_object['aggregations'].first['edmIsShownBy'] = 'http://soundcloud.com/piggj/introduction-to-world-war-i'
    end
    
    if edm_object['aggregations'] && url = edm_object['aggregations'].first['edmIsShownBy']
    
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
