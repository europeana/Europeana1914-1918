##
# Custom Formtastic input to display YYYY-MM-DD string as date selects
#
# @see https://github.com/justinfrench/formtastic
class StringDateInput
  include Formtastic::Inputs::Base
  include Formtastic::Inputs::Base::Timeish

  def fragment_input_html(fragment)
    opts = input_options.merge(:prefix => object_name, :field_name => fragment_name(fragment), :default => fragment_value(fragment), :include_blank => include_blank?)
    template.send(:"select_#{fragment}", fragment_value(fragment), opts, input_html_options.merge(:id => fragment_id(fragment)))
  end

  def fragment_value(fragment)
    if value.nil?
      nil
    else
      date = value.split('-')
      
      case fragment
      when :year
        date[0].blank? ? nil : Date.civil(date[0].to_i, 1, 1)
      when :month
        date[1].blank? ? nil : Date.civil(Date.today.year, date[1].to_i, 1)
      when :day
        date[2].blank? ? nil : Date.civil(Date.today.year, 1, date[2].to_i)
      end
    end
  end
  
  def time_fragments
    []
  end
end
