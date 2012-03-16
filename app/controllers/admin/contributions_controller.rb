class Admin::ContributionsController < AdminController
  class Options
    attr_accessor :fields
  end
  
  class ExportSettings
    attr_accessor :format, :start_date, :end_date, :exclude
  end
  
  # GET /admin/contributions
  def index
    @options = Options.new
    @options.fields = session[:admin][:fields]

    @sort = params[:sort]
    @order = (params[:order].present? && [ 'DESC', 'ASC' ].include?(params[:order].upcase)) ? params[:order] : 'DESC'
    @contributor = params[:contributor_id].present? ? User.find(params[:contributor_id]) : nil
    
    @contributions = {
      :draft      => search_contributions(:draft, @query, search_options),
      :submitted  => search_contributions(:submitted, @query, search_options),
      :approved   => search_contributions(:approved, @query, search_options),
    }
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
        send_data render_to_string, :filename => "collection-#{timestamp}.xml", :type => 'application/xml'
        RunCoCo.export_logger.info("Export to XML by #{current_user.username}")
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
      session[:admin][:fields] = [ 'title', 'attachments', 'created_at', 'field_cataloguer_terms', 'field_ticket' ]
    end
  end
  
  ##
  # Fetch contributions for export in batches and yield each.
  #
  # Looks to @settings controller instance variable for export options:
  # * @settings.exclude: exclude attachment records with files having this 
  #   extension
  # * @settings.start_date: only yield contributions published on or after
  #   this date/time
  # * @settings.end_date: only yield contributions published on or before
  #   this date/time
  #
  # @example
  #   with_exported_contributions do |contribution|
  #     puts contribution.title
  #   end
  def with_exported_contributions # :nodoc:
    if @settings.exclude.present?
      ext = @settings.exclude
      unless ext[0] == '.'
        ext = '.' + ext
      end
    end
    
    conditions = [ 'approved_at IS NOT NULL AND published_at IS NOT NULL' ]
    
    if @settings.start_date.present?
      conditions[0] << ' AND published_at >= ?'
      conditions << @settings.start_date
    end
    
    if @settings.end_date.present?
      conditions[0] << ' AND published_at <= ?'
      conditions << @settings.end_date
    end
    
    Contribution.find_each(
      :conditions => conditions,
      :include => [ { :attachments => { :metadata => MetadataRecord.taxonomy_associations } }, { :metadata => MetadataRecord.taxonomy_associations }, { :contributor => :contact } ],
      :batch_size => 25
    ) do |contribution|
    
      if params[:exclude]
        contribution.attachments.reject! do |a|
          File.extname(a.file.path) == ext
        end
      end
    
      yield contribution
    end
  end
  helper_method :with_exported_contributions
  
  def export_as_csv
    csv_class.generate do |csv|
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

      with_exported_contributions do |c|
        row = [ c.id, c.title, c.contributor.contact.full_name, url_for(c), c.created_at ] +
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
