# encoding: UTF-8
class AddHungarianAndSlovakianLocales < ActiveRecord::Migration
  LANGUAGE_NAMES = [ "Magyar", "Slovenčina" ]
  LOCALES = [ "hu", "sk" ]
  
  def self.up
    if mf = MetadataField.find_by_name("lang")
      LANGUAGE_NAMES.each do |lang|
        tt = TaxonomyTerm.new(:term => lang)
        mf.taxonomy_terms << tt
      end
    end
    
    RunCoCo.configuration[:ui_locales] = RunCoCo.configuration[:ui_locales] + LOCALES
    RunCoCo.configuration.save
  end

  def self.down
    if mf = MetadataField.find_by_name("lang")
      LANGUAGE_NAMES.each do |lang|
        if tt = mf.taxonomy_terms.find_by_term(lang)
          tt.destroy
        end
      end
    end
    
    RunCoCo.configuration[:ui_locales] = RunCoCo.configuration[:ui_locales] - LOCALES
    RunCoCo.configuration.save
  end
end
