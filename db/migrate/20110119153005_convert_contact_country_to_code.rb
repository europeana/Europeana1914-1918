class ConvertContactCountryToCode < ActiveRecord::Migration
  def self.up
    LocalizedCountrySelect
    
    result = execute("SELECT id, country FROM contacts WHERE country IS NOT NULL")
    result.each do |row|
      id = row[0]
      country = row[1]
      country_code = I18n.translate(:countries, :locale => :en).index(country)
      unless country_code.blank?
        execute "UPDATE contacts SET country='#{country_code.to_s}' WHERE id=#{id}"
      end
    end
  end

  def self.down
    LocalizedCountrySelect
    
    result = execute("SELECT id, country FROM contacts WHERE country IS NOT NULL")
    result.each do |row|
      id = row[0]
      country_code = row[1]
      country = I18n.translate(country_code.to_sym, :scope => :countries, :locale => :en)
      unless country.blank?
        execute "UPDATE contacts SET country='#{country}' WHERE id=#{id}"
      end
    end
  end
end
