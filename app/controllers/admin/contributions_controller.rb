require 'zlib'

class Admin::ContributionsController < AdminController
  class Options
    attr_accessor :fields
  end
  
  class ExportSettings
    attr_accessor :format, :start_date, :end_date, :exclude, :institution_id
  end
  
  # GET /admin/contributions
  def index
    @options = Options.new
    @options.fields = session[:admin][:fields]

    @sort = params[:sort]
    @order = (params[:order].present? && [ 'DESC', 'ASC' ].include?(params[:order].upcase)) ? params[:order] : 'DESC'
    @contributor = params[:contributor_id].present? ? User.find(params[:contributor_id]) : nil
    @status = params[:status]
    
    statuses = [ :draft, :submitted, :approved, :revised, :withdrawn, :rejected ]
    
    if @contributor
      @contributions = {}
      statuses.each do |status|
        @contributions[status] = activerecord_search_contributions(status, @query, search_options)
      end
    elsif @status.present? && statuses.include?(@status.to_sym)
      @contributions = activerecord_search_contributions(@status.to_sym, @query, search_options)
    elsif @query.present? 
      @contributions = activerecord_search_contributions(nil, @query, search_options)
    else
      @counts = {}
      statuses.each do |status|
        @counts[status] = activerecord_search_contributions(status, @query, search_options).total_entries
      end
    end
  end
  
  # PUT /admin/contributions/options
  def options
    if params[:options] && params[:options][:fields]
      field_names = contribution_fields.collect { |f| f.last }
      session[:admin][:fields] = params[:options][:fields].select { |f| field_names.include?(f) }
    end
    redirect_to :action => :index
  end
  
  # GET /admin/contributions/search
  def search
    if params[:q].present?
      @query = params[:q]
    end
    index
    render :action => :index
  end

  # GET /admin/contributions/export
  def export
    current_user.may_administer_contributions!

    @settings = ExportSettings.new
    if params[:settings]
      @settings.format = params[:settings][:format]
      @settings.exclude = params[:settings][:exclude]
      @settings.institution_id = params[:settings][:institution_id]
      if (1..5).inject(true) { |present, i| present && params[:settings]["start_date(#{i}i)"].present? }
        @settings.start_date = DateTime.civil(params[:settings]["start_date(1i)"].to_i, params[:settings]["start_date(2i)"].to_i, params[:settings]["start_date(3i)"].to_i, params[:settings]["start_date(4i)"].to_i, params[:settings]["start_date(5i)"].to_i)
      end
      if (1..5).inject(true) { |present, i| present && params[:settings]["end_date(#{i}i)"].present? }
        @settings.end_date = DateTime.civil(params[:settings]["end_date(1i)"].to_i, params[:settings]["end_date(2i)"].to_i, params[:settings]["end_date(3i)"].to_i, params[:settings]["end_date(4i)"].to_i, params[:settings]["end_date(5i)"].to_i)
      end
    else
      @settings.format = 'xml'
    end
    
    timestamp = Time.now.strftime('%Y%m%d%H%M%S')
    
    respond_to do |format|
      format.html do
        if params[:settings].present? && params[:settings][:format].present?
          settings = params[:settings].clone
          format = settings.delete('format')
          redirect_to export_admin_contributions_url(:format => format, :settings => settings)
        end
      end
      format.csv do
        send_data export_as_csv, :filename => "collection-#{timestamp}.csv", :type => 'text/csv'
        RunCoCo.export_logger.info("Export to CSV by #{current_user.username}")
      end
      format.xml do
        @metadata_fields = MetadataField.all.collect { |mf| mf.name }

        xml_filename = "collection-#{timestamp}.xml.gz"
        xml_filepath = File.join(Rails.root, 'private', 'exports', xml_filename)
        
        spawn_block do
          Zlib::GzipWriter.open(xml_filepath) do |gz|
            gz.write(render_to_string)
          end
          RunCoCo.export_logger.info("Export to XML by #{current_user.username} saved as #{xml_filename}")
          if current_user.email.present?
            ExportsMailer.complete(current_user.email, xml_filename).deliver
          end
        end
        
        flash[:notice] = "Generating XML export in the file #{xml_filename}"
        redirect_to admin_root_url
      end
    end
  end

protected

  def authorize!
    current_user.may_administer_contributions!
  end
  
  def init_session
    super
    session[:admin] ||= {}
    unless session[:admin][:fields].present?
      session[:admin][:fields] = [ 'title', 'attachments', 'created_at', 'cataloguer', 'field_ticket' ]
    end
  end
  
  def with_exported_contributions
    settings_hash = { 
      :exclude => @settings.exclude,
      :start_date => @settings.start_date,
      :end_date => @settings.end_date,
      :institution_id => @settings.institution_id
    }
    Contribution.export(settings_hash) do |contribution|
      yield contribution
    end
  end
  helper_method :with_exported_contributions
  
  def export_as_csv
    csv_class.generate do |csv|
      # Column headings in first row
      attributes = [ :id, :title, :contributor, :url, :created_at, :provider, :data_provider ] +
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

      with_exported_contributions do |c|
        row = [ c.id, c.title, c.contributor.contact.full_name, url_for(c), c.created_at, "Europeana 1914 - 1918", (c.contributor.institution.present? ? c.contributor.institution.name : '') ] +
          MetadataField.all.collect { |mf| c.metadata.fields[mf.name] }
        csv << row
      end
    end
  end

  def search_options
    search_options = {}
    [ :page, :order, :sort, :contributor_id ].each do |key|
      search_options[key] = params[key]
    end
    if search_options[:order].blank? 
      search_options[:order] = 'DESC'
    end
    if search_options[:sort].blank? 
      search_options[:sort] = 'created_at'
    end
    search_options
  end
end
