# This seems to be required to get Compass to resolve image-url() to /assets
# instead of /images.
# @todo Check this is compatible with themes_for_rails
RunCoCo::Application.configure do
  config.compass.http_generated_images_path = '/assets' 
end
