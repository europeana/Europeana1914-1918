module Formtastic
  module Inputs
    module Base
      def mandatory_notice
        template.content_tag(
          :span, 
          ::I18n.t('common.help_text.mandatory'), 
          :class => 'mandatory'
        )
      end
    
      def hint_html
        hints = []
        
        if required?
          hints << mandatory_notice
        end
        if hint?
          hints << Formtastic::Util.html_safe(hint_text)
        end
        
        if hints.length > 0
          template.content_tag(
            :p, 
            hints.join(' '), 
            { :class => (options[:hint_class] || builder.default_hint_class) },
            false
          )
        end
      end
    end
  end
end
