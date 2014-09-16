require 'google/api_client'

##
# Public usage statistics for this site, from Google Analytics
#
class StatisticsController < ApplicationController
  # GET /statistics
  def index
    cache_key = "google/api/analytics/results"
    
    if fragment_exist?(cache_key)
      @results = YAML::load(read_fragment(cache_key))
    else
      raise RuntimeError unless configured?
      
      user = legato_user
      @profile = user.profiles.select { |profile| profile.web_property_id == RunCoCo.configuration.google_analytics_key }.first
      @results = {}
      
      interval_date_params.each_pair do |interval, date_params|
        unfiltered_results      = GoogleAnalytics.results(@profile, date_params)
        object_pageviews        = GoogleAnalytics.object_pageviews(@profile).results(date_params)
        europeana_pageviews     = GoogleAnalytics.europeana_pageviews(@profile).results(date_params)
        @results[interval]  = {
          :visits               => unfiltered_results.totals_for_all_results['visits'],
          :avgTimeOnSite        => unfiltered_results.totals_for_all_results['avgTimeOnSite'],
          :object_pageviews     => object_pageviews.totals_for_all_results['pageviews'],
          :europeana_pageviews  => europeana_pageviews.totals_for_all_results['pageviews'],
          :date_params          => date_params
        }
      end
      
      write_fragment(cache_key, @results.to_yaml, :expires_in => 1.day)
    end
    
    @results.each_pair do |interval, results|
      results[:label] = interval_label(interval, results[:date_params])
    end
    
  rescue
    # See errors in dev environment...
    raise if Rails.configuration.consider_all_requests_local
    
    # ... otherwise, views display a "no statistics available" message if 
    # @results is empty
  end
  
private
  
  ##
  # Gets date params for different intervals to pass to GA API
  #
  # @return [Hash<Hash>] Keyed by interval name, each contained hash having keys
  #   :start_date and :end_date
  #
  def interval_date_params
    time          = Time.now
    week_start    = Time.new(time.year, time.month, time.day, 0, 0, 0) - (time.wday - 1).send(:days) # Most recent Monday
    month_start   = Time.new(time.year, time.month, 1, 0, 0, 0)
    quarter       = ((time.month - 1) / 3) + 1
    quarter_start = Time.new(time.year, ((quarter - 1) * 3) + 1, 1, 0, 0, 0)
    last_quarter  = quarter == 1 ? 4 : quarter - 1
    year_start    = Time.new(time.year, 1, 1, 0, 0, 0)
    
    date_params = {
      :this_week    => { :start_date => week_start, :end_date => time },
      :last_week    => { :start_date => week_start - 1.week, :end_date => week_start - 1 },
      :this_month   => { :start_date => month_start, :end_date => time },
      :last_month   => { :start_date => month_start - 1.month, :end_date => month_start - 1 },
      :last_quarter => { :start_date => quarter_start - 3.months, :end_date => quarter_start - 1, :number => last_quarter },
      :last_year    => { :start_date => year_start - 1.year, :end_date => year_start - 1 }
    }
  end
  
  def interval_label(interval, date_params)
    case interval
    when :this_week
      (I18n.l(Date.parse(date_params[:start_date].to_s), :format => :long_with_day) + ' &ndash; ' + I18n.l(Date.parse(date_params[:end_date].to_s), :format => :long_with_day))
    when :last_week
      (I18n.l(Date.parse(date_params[:start_date].to_s), :format => :long_with_day) + ' &ndash; ' + I18n.l(Date.parse(date_params[:end_date].to_s), :format => :long_with_day))
    when :this_month
      I18n.l(Date.parse(date_params[:start_date].to_s), :format => :month_and_year)
    when :last_month
      I18n.l(Date.parse(date_params[:start_date].to_s), :format => :month_and_year)
    when :last_quarter
      I18n.l(Date.parse(date_params[:start_date].to_s), :format => :quarter, :number => date_params[:number])
    when :last_year
      date_params[:start_date].year
    end
  end
  
  ##
  # Gets a Legato service account user to access Google Analytics API
  #
  # @return [Legato::User] Authorized user
  # @see https://github.com/tpitale/legato/wiki/OAuth2-and-Google
  #
  def legato_user
     scope = "https://www.googleapis.com/auth/analytics.readonly"
     key = Google::APIClient::PKCS12.load_key(google_api_key_filename, "notasecret")
     service_account = Google::APIClient::JWTAsserter.new(RunCoCo.configuration.google_api_email, scope, key)
     oauth_client = OAuth2::Client.new("", "", {
        :authorize_url => 'https://accounts.google.com/o/oauth2/auth',
        :token_url => 'https://accounts.google.com/o/oauth2/token'
     })
     client = Google::APIClient.new(:application_name => 'RunCoCo', :application_version => RunCoCo.configuration.site_name)
     client.authorization = service_account.authorize
     token = OAuth2::AccessToken.new(oauth_client, client.authorization.access_token)
     
     Legato::User.new(token)
  end
  
  ##
  # Checks whether configuration pre-requisites are met
  #
  # @return [Boolean]
  #
  def configured?
    File.exists?(google_api_key_filename) && 
      RunCoCo.configuration.google_api_email.present? &&
      RunCoCo.configuration.google_analytics_key.present?
  end
  
  ##
  # Returns the expected filename of the Google API service account private key
  #
  # @return [String] Private key filename
  #
  def google_api_key_filename
    File.join(Rails.root, "config", "google_api_key.p12")
  end
  
end
