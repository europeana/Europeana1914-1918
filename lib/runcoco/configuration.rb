module RunCoCo
  ##
  # App configuration, modified through web UI at "/admin/config".
  # 
  # Available settings:
  # - site_name: 
  #     Website name. Default is 'Run a Community Collection'.
  # - site_url:
  #     Full URL at which the site is accessed.
  # - registration_required: 
  #     If +true+, people have to register a user account in order to
  #     contribute. Otherwise, people can contribute as guests. Default is
  #     +true+.
  # - publish_contributions:
  #     Enable the public display of contributions. If set to +false+,
  #     contributions can still be collected, but are not displayed publicly. 
  #     Default is +true+.
  # - contribution_approval_required:
  #     Only publish approved contributions. Default is +true+. Has no effect
  #     if +publish_contributions+ is +false+.
  # - max_upload_size:
  #     Maximum upload size in bytes. Default is 5 megabytes.
  # - allowed_upload_extensions:
  #     Allowed file extensions for uploaded files. If blank, RunCoCo will 
  #     allow any file type to be uploaded (the default).
  # - uploadify:
  #     Use Uploadify to handle attachment file uploads. See
  #     <http://www.uploadify.com/>. Default +false+.
  # - gmap_api_key:
  #     Google Maps API key. If not set, Google Maps can not be used for
  #     inputting geographical location data. Sign up at
  #     <http://code.google.com/apis/maps/signup.html>. Default is no key.
  # - google_api_email:
  #     Google API service account email address.
  # - ui_locales:
  #     Locales to link to in the page layout, in the order given. Default is
  #     none.
  #
  class Configuration
    include ActiveModel::Validations
    include Singleton
    
    DEFAULTS = {
      :site_name                      => 'Run a Community Collection',
      :site_url                       => '',
      :registration_required          => true,
      :publish_contributions          => true,
      :contribution_approval_required => true,
      :max_upload_size                => 5.megabytes,
      :allowed_upload_extensions      => [],
      :gmap_api_key                   => nil,
      :google_analytics_key           => nil,
      :google_api_email               => nil,
      :bing_translate_key             => nil,
      :bing_client_id                 => nil,
      :bing_client_secret             => nil,
      :sharethis_id                   => nil,
      :uploadify                      => false,
      :ui_locales                     => nil,
      :banner_active                  => false,
      :banner_text                    => '',
      :search_engine                  => :active_record
    }

    DEFAULTS.each_key do |name|
      define_method(name) do
        self[name]
      end
      define_method(:"#{name.to_s}=") do |value|
        self[name] = value
      end
    end
    
    validates_numericality_of :max_upload_size, :greater_than => 0
    validates_format_of :relative_url_root , :with => /\A(\/\w+)?\Z/
    validates_inclusion_of :search_engine, :in => [ :active_record, :solr, :sphinx ]
    
    def initialize
      @settings = {}
      self.load
      
      DEFAULTS.each_pair do |name, value|
        @settings[name] ||= Setting.new(:name => name.to_s, :value => value)
      end
    end
    
    ##
    # Returns true if RunCoCo is configured to require registration.
    #
    # Set via +RunCoCo.configuration.registration_required+
    def registration_required?
      self[:registration_required] == true
    end
    
    ##
    # Returns true if RunCoCo is configured to publish contributions.
    #
    # Set via +RunCoCo.configuration.publish_contributions+
    def publish_contributions?
      self[:publish_contributions] == true
    end
    
    ##
    # Returns true if the banner is active
    #
    # Set via +RunCoCo.configuration.banner_active+
    def banner_active?
      self[:banner_active] == true
    end

    # Loads configuration settings from database
    def load
      Setting.all.each do |setting|
        @settings[setting.name.to_sym] = setting
      end
      typecast!
      @settings
    end
    
    # Saves configuration settings to database
    def save
      return false unless valid?
      
      result = true
      Setting.transaction do
        @settings.each_value do |setting|
          result = result & setting.save
        end
      end
      result
    end
    
    ##
    # Gets the relative URL root at which the site is installed from the 
    # configured URL root.
    #
    # Provided for backwards compatibility with superseded relative_url_root 
    # setting.
    #
    # @return [String] Relative URL root of this site.
    #
    def relative_url_root
      return '' unless self[:site_url].present?
      
      URI.parse(self[:site_url]).path
    end
    
    # Returns the value of a single configuration setting
    def [](name)
      raise ArgumentError, "Unknown setting name #{name.inspect}" unless DEFAULTS.has_key?(name.to_sym)
      @settings[name].respond_to?(:value) ? @settings[name].value : nil
    end
    
    # Sets the value of a single configuration setting, but does not save it.
    def []=(name, value)
      raise ArgumentError, "Unknown setting name #{name.inspect}" unless DEFAULTS.has_key?(name.to_sym)
      if @settings[name].respond_to?(:value)
        @settings[name].value = value
      end
    end
    
    private
    def typecast!
      self[:max_upload_size] = self[:max_upload_size].to_i
      
      [ :publish_contributions, :registration_required, 
        :contribution_approval_required, :uploadify, :banner_active ].each do |boolean|
        self[boolean] = ActiveRecord::ConnectionAdapters::Column.value_to_boolean(self[boolean])
      end
    end
  end
end
