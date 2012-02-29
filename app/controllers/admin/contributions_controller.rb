class Admin::ContributionsController < AdminController
  class Options
    attr_accessor :fields
  end
  
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
  
  def options
    if params[:options] && params[:options][:fields]
      field_names = contribution_fields.collect { |f| f.last }
      session[:admin][:fields] = params[:options][:fields].select { |f| field_names.include?(f) }
    end
    redirect_to :action => :index
  end

  def search
    if params[:q].present?
      @query = params[:q]
    end
    index
    render :action => :index
  end

  def export
    current_user.may_export_contributions!

    respond_to do |format|
      format.csv do
        send_data export_as_csv, :filename => "contributions.csv", :type => 'text/csv'
      end
      format.xml do
        @contributions = export_dataset
        @metadata_fields = MetadataField.all.collect { |mf| mf.name }
        send_data render_to_string, :filename => "contributions.xml", :type => 'application/xml'
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
  
  def export_dataset
    contributions = Contribution.where('approved_at IS NOT NULL AND published_at IS NOT NULL').includes([ { :attachments => :metadata }, { :metadata => MetadataRecord.taxonomy_associations }, { :contributor => :contact } ]).order('created_at ASC')
    
    if params[:exclude]
      ext = params[:exclude]
      unless ext[0] == '.'
        ext = '.' + ext
      end
      
      contributions.each do |c|
        c.attachments.reject! do |a|
          File.extname(a.file.path) == ext
        end
      end
    end
    
    contributions
  end
  
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

      export_dataset.each do |c|
        row = [ c.id, c.title, c.contributor.contact.full_name, url_for(c), c.created_at ] +
          MetadataField.all.collect { |mf| c.metadata.fields[mf.name] }
        csv << row
      end
    end
  end

  def csv_class
    if RUBY_VERSION >= "1.9"
      require 'csv'
      CSV
    else
      require 'fastercsv'
      FasterCSV
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
