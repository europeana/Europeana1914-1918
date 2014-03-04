require (RUBY_VERSION >= '1.9' ? 'csv' : 'fastercsv')

class CSVExportJob < ExportJob
  FORMAT    = 'CSV'
  EXTENSION = '.csv'
  
  include Rails.application.routes.url_helpers
  
  def perform
    ::ActiveRecord::Base.cache do
      File.open(self.file.path, 'w') do |csv|
        # Column headings in first row
        csv << csv_headings
        
        Contribution.export(@filters) do |c|
          csv << csv_contribution_row(c)
        end
      end
    end
  end
  
protected
  
  def csv_headings
    attributes = [ :id, :title, :contributor, :url, :created_at, :provider, :data_provider ] +
      MetadataField.all.collect { |mf| mf.title }
    attributes.collect do |attribute|
      if attribute.instance_of? Symbol
        Contribution.human_attribute_name(attribute)
      elsif attribute.instance_of? Array
        attribute.first.human_attribute_name(attribute.last)
      else
        attribute
      end
    end.to_csv
  end

  def csv_contribution_row(contribution)
    row = [ 
      contribution.id, 
      contribution.title, 
      contribution.contributor.contact.full_name, 
      url_for(contribution), 
      contribution.created_at, 
      "Europeana 1914 - 1918", 
      (contribution.contributor.institution.present? ? contribution.contributor.institution.name : '') 
    ] +
      MetadataField.all.collect { |mf| contribution.metadata.fields[mf.name] }
    
    row.to_csv
  end

end
