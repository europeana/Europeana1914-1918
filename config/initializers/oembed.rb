require 'oembed'

# Register oEmbed providers to support.
# @see OEmbed::Providers
OEmbed::Providers.register(OEmbed::Providers::SoundCloud)
OEmbed::Providers.register(OEmbed::Providers::Vimeo)
OEmbed::Providers.register(OEmbed::Providers::Youtube)

# Custom providers.
# @see RunCoCo::OEmbed::Providers
OEmbed::Providers.register(RunCoCo::OEmbed::Providers::Dailymotion)
