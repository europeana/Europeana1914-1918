class Admin::ContributionsController < AdminController
  class Options
    attr_accessor :fields
  end
  
  def index
    wheres = {
      :submitted => [ 'submitted_at IS NOT NULL AND approved_at IS NULL' ],
      :approved => [ 'submitted_at IS NOT NULL AND approved_at IS NOT NULL' ]
    }
    
    if params[:contributor_id].present?
      @contributor = User.find(params[:contributor_id])
      wheres.each_key do |key| 
        wheres[key][0] << ' AND contributor_id=?'
        wheres[key] << params[:contributor_id]
      end
    end
    
    @options = Options.new
    @options.fields = session[:admin][:fields]
    
    @submitted = Contribution.where(wheres[:submitted]).order('submitted_at ASC').paginate(:page => params[:page])
    @approved = Contribution.where(wheres[:approved]).order('approved_at DESC').paginate(:page => params[:page])
  end
  
  def options
    if params[:options] && params[:options][:fields]
      field_names = contribution_fields.collect { |f| f.last }
      session[:admin][:fields] = params[:options][:fields].select { |f| field_names.include?(f) }
    end
    redirect_to :action => :index
  end

  def search
    unless params[:q].present?
      index
      render :action => :index
      return
    end
    
    @query = params[:q]
    
    @submitted = search_contributions(:submitted, @query, :page => params[:page], :order => 'submitted_at ASC')
    @approved = search_contributions(:approved, @query, :page => params[:page], :order => 'approved_at DESC')

    @options = Options.new
    @options.fields = session[:admin][:fields]

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
      session[:admin][:fields] = [ 'title', 'attachments', 'field_cataloguer_terms' ]
    end
  end
  
  def export_dataset
    taxonomy_associations = MetadataField.where(:field_type => 'taxonomy').collect do |taxonomy_field|
      { taxonomy_field.collection_id => 'translations' }
    end
    Contribution.where('approved_at IS NOT NULL AND published_at IS NOT NULL').includes([ { :attachments => :metadata }, { :metadata => taxonomy_associations }, { :contributor => :contact } ]).order('created_at ASC')
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
end
