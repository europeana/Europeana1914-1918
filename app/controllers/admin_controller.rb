class AdminController < ApplicationController
  before_filter :authenticate_user!
  before_filter :authorize!

  def export
    respond_to do |format|
      format.csv do
        current_user.may_export_as_csv!
        send_data export_as_csv, :filename => "contributions.csv", :type => 'text/csv'
      end
    end
  end

  protected
  def authorize!
    current_user.may_access_admin_area!
  end
  
  def export_as_csv
    require 'fastercsv'
    
    FasterCSV.generate do |csv|
      # Column headings in first row
      attributes = [ :id, :title, :contributor, :url, :created_at ] + 
        MetadataField.all.collect { |mf| mf.title }
      csv << attributes.collect do |attribute| 
        if attribute.instance_of? Symbol
          Contribution.human_attribute_name(attribute) 
        elsif attribute.instance_of? Array
          attribute.first.human_attribute_name(attribute.last)
        else
          attribute
        end
      end
      
      Contribution.order('created_at ASC').each do |c|
        row = [ c.id, c.title, c.contributor.contact.full_name, url_for(c), c.created_at ] + 
          MetadataField.all.collect { |mf| c.metadata.fields[mf.name] }
        csv << row
      end
    end
  end
end

