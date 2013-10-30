require 'zlib'

class Admin::ContributionsController < AdminController
  class Options
    attr_accessor :fields
  end
  
  class ExportSettings
    attr_accessor :format, :start_date, :end_date, :exclude, :set, :institution_id
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
        @contributions[status] = Contribution.search(status, @query, search_options).results
      end
    elsif @status.present? && statuses.include?(@status.to_sym)
      @contributions = Contribution.search(@status.to_sym, @query, search_options).results
    elsif @query.present? 
      @contributions = Contribution.search(nil, @query, search_options).results
    else
      @counts = {}
      statuses.each do |status|
        @counts[status] = Contribution.search(status, @query, search_options).results.total_entries
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
      @settings.set = params[:settings][:set]
      @settings.institution_id = params[:settings][:institution_id]
      if (1..5).inject(true) { |present, i| present && params[:settings]["start_date(#{i}i)"].present? }
        @settings.start_date = DateTime.civil(params[:settings]["start_date(1i)"].to_i, params[:settings]["start_date(2i)"].to_i, params[:settings]["start_date(3i)"].to_i, params[:settings]["start_date(4i)"].to_i, params[:settings]["start_date(5i)"].to_i)
      end
      if (1..5).inject(true) { |present, i| present && params[:settings]["end_date(#{i}i)"].present? }
        @settings.end_date = DateTime.civil(params[:settings]["end_date(1i)"].to_i, params[:settings]["end_date(2i)"].to_i, params[:settings]["end_date(3i)"].to_i, params[:settings]["end_date(4i)"].to_i, params[:settings]["end_date(5i)"].to_i)
      end
    else
      @settings.format = 'xml'
      @settings.set = 'all'
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
        job_options = settings_hash.merge(:user_id => current_user.id)
        Delayed::Job.enqueue XMLExportJob.new(job_options)
        
        flash[:notice] = "Generating XML export in the background"
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
  
  def settings_hash
    {
      :exclude => @settings.exclude,
      :start_date => @settings.start_date,
      :end_date => @settings.end_date,
      :set => @settings.set,
      :institution_id => @settings.institution_id
    }
  end
  
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

      Contribution.export(settings_hash) do |c|
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
