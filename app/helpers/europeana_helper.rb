# encoding: utf-8

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
  
  def europeana_record_id_url(record_id)
    id = record_id[1..-1]
    europeana_record_url(id)
  end
  
  ##
  # Formats an appropriate value for display of an EDM proxy object field
  #
  # Returns: all non-empty values joined, URLs as links.
  #
  # @param [Hash,Array<Hash>] proxy Proxy object(s) from an EDM record
  # @param [String] field_name Name of the field to retrieve
  # @param [Hash] options Options for formatting the field
  # @option options [Boolean] :link If true, format URLs as links
  # @option options [Array<Hash>] :concepts EDM concepts. If present, any URI
  #   values where the pref label is included will be removed from the returned
  #   string.
  # @return [String] Value to display for the field
  # @todo Add some validation to proxy param to aid debugging
  #
  def edm_proxy_field(proxy, field_name, options = {})
    return nil unless proxy.is_a?(Array) ||
      (proxy.respond_to?(:has_key?) && proxy.has_key?(field_name))
    
    options.reverse_merge!({:link => true})
    
    proxy_field_values = edm_proxy_field_values(proxy, field_name)
    
    proxy_field_values.reject!(&:blank?)
    if options[:concepts].present?
      proxy_field_values = edm_translate_concept_uris(proxy_field_values, options[:concepts])
    end
    if options[:link]
      proxy_field_values.collect! { |value| edm_link_to_search(value, field_name) }
      proxy_field_values.collect! { |value| edm_link_to_url(value, field_name) }
    end
    proxy_field_values.blank? ? nil : proxy_field_values.join('; ')
  end
  
  def edm_proxy_field_values(proxy, field_name)
    if proxy.is_a?(Array)
      proxy.collect { |one_proxy| edm_proxy_field_values(one_proxy, field_name) }
    elsif proxy[field_name].is_a?(String)
      [ proxy[field_name] ]
    elsif proxy[field_name].respond_to?(:values)
      proxy[field_name].values
    else
      [ ]
    end.flatten
  end
  
  # @param [Array<String>] values
  # @param [Array<Hash>] concepts
  # @return [Array<String>]
  def edm_translate_concept_uris(values, concepts)
    values.dup.each_with_index do |value, i|
      next unless value =~ /\A#{URI::regexp}\Z/
      next unless (uri_concept = concepts.find { |concept| concept['about'] == value }).present?
      next unless uri_concept['prefLabel'].respond_to?(:has_key?)
      
      locale = uri_concept['prefLabel'].has_key?(I18n.locale.to_s) ? I18n.locale.to_s : I18n.default_locale.to_s
      if uri_concept['prefLabel'][locale].present?
        values[i] = uri_concept['prefLabel'][locale]
      end
    end
    
    values.flatten
  end
  
  def edm_link_to_search(value, field_name)
    link_fields = [
      'dcCreator', 'dcDate', 'dctermsTemporal', 'dcType', 'dcFormat',
      'dctermsMedium', 'dcSubject', 'dcCoverage', 'dctermsSpatial',
      'edmDataProvider', 'edmProvider', 'edmCountry'
    ]
    
    if value =~ /\A#{URI::regexp}\Z/
      value
    elsif link_fields.include?(field_name)
      link_to(value, { :action => :search, :q => '"' + value.to_s + '"' })
    else
      value
    end
  end
  
  def edm_link_to_url(url, field_name)
    text = url
    if field_name == 'edmRights'
      text = rightsLabel(url, true)
    end
    
    if url =~ /\A#{URI::regexp}\Z/
      href = url.gsub(' ', '+')
      link_to(text, href, :target => '_blank')
    else
      text
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
    nil
  end
  
  ##
  # Gets the oEmbed HTML from an EDM object's edm:isShownBy aggregation
  #
  # Responses from oEmbed providers are cached for 1 day.
  #
  # @param [Hash] Representation of an EDM object
  # @return [Hash] Fields returned from oEmbed provider
  #
  def oembed_fields(edm_object)
    if edm_object['aggregations'] && (url = edm_object['aggregations'].first['edmIsShownBy'])
    
      cache_key = "oembed/response/" + Digest::MD5.hexdigest(url)
      if controller.fragment_exist?(cache_key)
        resource_fields = YAML::load(controller.read_fragment(cache_key))
      elsif provider = OEmbed::Providers.find(url)
        resource = provider.get(url)
        resource_fields = resource.fields
        controller.write_fragment(cache_key, resource_fields.to_yaml, :expires_in => 1.day)
      end

    end
    
    resource_fields
  end
  
  # @param [Hash] Representation of an EDM object
  # @return [String] HTML for the oEmbed resource
  def oembed_html(edm_object)
    fields = oembed_fields(edm_object)
    fields.is_a?(Hash) ? fields['html'] : ''
  end

    
  def rightsLabel(key, withIcon=false, asJS=false)
    
    if(!key)
      return ''
    end
    
    rightsLabels = {
      "http://www.europeana.eu/rights/rr-f/" => {
        "label" => "Free Access - Rights Reserved",
        "icons" => ["icon-copyright"]
      },
      "http://www.europeana.eu/rights/rr-r/" => {
        "label" => "Restricted Access - Rights Reserved",
        "icons" => ["icon-copyright"]
      },
      "http://www.europeana.eu/rights/unknown/" => {
        "label" => "Unknown copyright status",
        "icons" => ["icon-unknown"]
      },
      "http://www.europeana.eu/rights/rr-p/" => {
        "label" => "Paid Access - Rights Reserved",
        "icons"  => ["icon-copyright"]
      },
      "http://creativecommons.org/publicdomain/mark/" => {
        "label" => "Public Domain marked",
        "icons" => ["icon-pd"]
      },
      "http://creativecommons.org/publicdomain/mark/1.0/" => {
        "label" => "Public Domain marked",
        "icons" => ["icon-pd"]
      },
      "http://creativecommons.org/publicdomain/zero/1.0/" => {
        "label" => "CC0",
        "icons" => ["icon-pd"]
      },
      "http://creativecommons.org/licenses/by/" => {
        "label" => "CC BY",
        "icons" => ["icon-cc", "icon-by"]
      },
      "http://creativecommons.org/licenses/by/3.0/" => {
        "label" =>  "CC BY 3.0",
        "icons" => ["icon-cc", "icon-by"]
      },
      "http://creativecommons.org/licenses/by-sa/" => {
        "label" => "CC BY-SA",
        "icons" => ["icon-cc", "icon-by", "icon-sa"]
      },
      "http://creativecommons.org/licenses/by-sa/3.0" => {
        "label" => "CC BY-SA 3.0",
        "icons" => ["icon-cc", "icon-by", "icon-sa"]
      },
      "http://creativecommons.org/licenses/by-sa/3.0/us/" => {
        "label" => "CC BY-SA 3.0 US",
        "icons" => ["icon-cc", "icon-by", "icon-sa"]
      },
      "http://creativecommons.org/licenses/by-nc/" => {
        "label" => "CC BY-NC",
        "icons" => ["icon-cc", "icon-by", "icon-nceu"]
      },
      "http://creativecommons.org/licenses/by-nc/2.0/uk/" =>
      {
        "label" => "CC BY-NC 2.0 UK",
        "icons" => ["icon-cc", "icon-by", "icon-nceu"]
      },
      "http://creativecommons.org/licenses/by-nc/3.0/pt/" => {
        "label" => "CC BY-NC 3.0 PT",
        "icons" => ["icon-cc", "icon-by", "icon-nceu"]
      },
      "http://creativecommons.org/licenses/by-nc-nd/" => {
        "label" => "CC BY-NC-ND",
        "icons" => ["icon-cc", "icon-by", "icon-nceu", "icon-nd"]
      },
      "http://creativecommons.org/licenses/by-nc-nd/1.0/" => {
        "label" => "CC BY-ND-NC 1.0",
        "icons" => ["icon-cc", "icon-by", "icon-nceu", "icon-nd"]
      },
      "http://creativecommons.org/licenses/by-nc-nd/2.0/" => {
        "label" => "CC BY-NC-ND 2.0",
        "icons" => ["icon-cc", "icon-by", "icon-nceu", "icon-nd"]
      },
      "http://creativecommons.org/licenses/by-nc-nd/2.0/uk/" => {
        "label" => "CC BY-NC-ND 2.0 UK",
        "icons" => ["icon-cc", "icon-by", "icon-nceu", "icon-nd"]
      },
      "http://creativecommons.org/licenses/by-nc-nd/3.0/" => {
        "label" => "CC BY-NC-ND 3.0",
        "icons" => ["icon-cc", "icon-by", "icon-nceu", "icon-nd"]
      },
      "http://creativecommons.org/licenses/by-nc-nd/3.0/nl/" => {
        "label" => "CC BY-NC-ND 3.0 NL",
        "icons" => ["icon-cc", "icon-by", "icon-nceu", "icon-nd"]
      },
      "http://creativecommons.org/licenses/by-nc-sa/" => {
        "label" => "CC BY-NC-SA",
        "icons" => ["icon-cc", "icon-by", "icon-nceu", "icon-sa"]
      },
      "http://creativecommons.org/licenses/by-nc-sa/3.0/" => {
        "label" => "CC BY-NC-SA 3.0",
        "icons" => ["icon-cc", "icon-by", "icon-nceu", "icon-sa"]
      },
      "http://creativecommons.org/licenses/by-nd/" => {
        "label" => "CC BY-ND",
        "icons" => ["icon-cc", "icon-by", "icon-nd"]
      },
      "http://creativecommons.org/licenses/by-nd/2.5/" => {
        "label" => "CC BY-ND 2.5",
        "icons" => ["icon-cc", "icon-by", "icon-nd"]
      }
    }
 
    if(asJS)
      require 'json'
      return rightsLabels.to_json
    end
    
     res = rightsLabels[key] ? rightsLabels[key]["label"]  :  key

     if withIcon && res != key
       iconStr = ''
       rightsLabels[key]["icons"].each do |icon|
         iconStr += '<span class="rights-icon ' + icon + '"></span> '
       end
       res = iconStr + '<span class="rights-text">' + res + '</span>'
       res = res.html_safe
     end
     
     res
  end
  
  
  def languageLabel(key, asJS=false)
    languageLabels = {    
      "en" => "English",
      "eu" => "Basque",
      "bg" => "Български",
      "ca" => "Català",
      "cs" => "Čeština",
      "da" => "Dansk",
      "de" => "Deutsch",
      "el" => "Ελληνικά",
      "es" => "Español",
      "et" => "Eesti",
      "fr" => "Français",
      "ga" => "Gaeilge",
      "hr" => "Hrvatski",
      "is" => "Íslenska",
      "it" => "Italiano",
      "lt" => "Lietuvių",
      "lv" => "Latviešu",
      "hu" => "Magyar",
      "mt" => "Malti",
      "nl" => "Nederlands",
      "no" => "Norsk",
      "pl" => "Polski",
      "pt" => "Português",
      "ro" => "Română",
      "ru" => "Русский",
      "sl" => "Slovenščina",
      "sk" => "Slovenský",
      "fi" => "Suomi",
      "sv" => "Svenska",
      "uk" => "Українська"
    }
    
    if(asJS)
      require 'json'
      return languageLabels.to_json
    end

    languageLabels[key] || key
    
  end
  
  def remote_video_mime_type(url, max_redirects = 5)
    if max_redirects == 0
      nil
    elsif /\.flv\Z/.match(url)
      'video/x-flv'
    elsif /\.mp4\Z/.match(url)
      'video/mp4'
    else
      headers = get_http_headers(url)
      if headers.is_a?(Net::HTTPRedirection) && (location = headers['location']) && (location != url)
        remote_video_mime_type(location, max_redirects - 1)
      else
        headers['content-type']
      end
    end
  end
end
