module Admin::ConfigHelper
  # Collection of options for ui_locales setting form field,
  # to be passed to Formtastic input via :collection option.
  def ui_locales_collection
    I18n.available_locales.map do |locale|
      [ RunCoCo::Application::LANG_LABELS[locale.to_s], locale.to_s ]
    end
  end
  
  def ui_locales_sentence
    locales = RunCoCo.configuration.ui_locales
    if locales.is_a? Array
      locales.map do |locale|
        RunCoCo::Application::LANG_LABELS[locale.to_s]
      end.to_sentence
    else
      locales
    end
  end
end
