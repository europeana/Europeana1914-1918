module RunCoCo
  module OEmbed
    module Providers
      Dailymotion = ::OEmbed::Provider.new("http://www.dailymotion.com/services/oembed?format={format}")
      Dailymotion << "http://www.dailymotion.com/video/*"
    end
  end
end
