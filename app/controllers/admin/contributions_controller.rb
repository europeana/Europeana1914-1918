class Admin::ContributionsController < AdminController
  class Options
    attr_accessor :fields
  end
  
  def index
    @contributions = {
      :submitted  => Contribution.where('submitted_at IS NOT NULL AND approved_at IS NULL').order('submitted_at ASC'),
      :approved   => Contribution.where('submitted_at IS NOT NULL AND approved_at IS NOT NULL').order('approved_at DESC'),
      :draft      => Contribution.where('submitted_at IS NULL AND approved_at IS NULL').order('created_at DESC'),
    }
    
    @options = Options.new
    @options.fields = session[:admin][:fields]

    joins = :metadata

    @contributor = params[:contributor_id].present? ? User.find(params[:contributor_id]) : nil
    if params[:sort].present?
      @sort = params[:sort]
      if MetadataRecord.taxonomy_associations.include?(@sort.to_sym)
        sort_col = "taxonomy_terms.term"
        joins = { :metadata => @sort.to_sym }
      elsif @sort == 'contributor'
        sort_col = "contacts.full_name"
        joins = [ :metadata, { :contributor => :contact } ]
      elsif @sort == 'approver'
        sort_col = "contacts.full_name"
        joins = [ :metadata, { :approver => :contact } ]
#      elsif @sort == 'attachments'
#        sort_col = "COUNT(attachments.id)"
#        joins = "INNER JOIN `metadata_records` ON `metadata_records`.`id` = `contributions`.`metadata_record_id` LEFT JOIN `attachments` ON `attachments`.`contribution_id` = `contributions`.`id`"
      else
        sort_col = @sort
      end
    end
    @order = (params[:order].present? && [ 'DESC', 'ASC' ].include?(params[:order].upcase)) ? params[:order] : 'ASC'
    
    @contributions.each_key do |key|
      @contributions[key] = @contributions[key].where(:contributor_id => @contributor.id) unless @contributor.nil?
      @contributions[key] = @contributions[key].reorder("#{sort_col} #{@order}") unless @sort.nil?
      @contributions[key] = @contributions[key].joins(joins).paginate(:page => params[:page])
    end
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
      session[:admin][:fields] = [ 'title', 'attachments', 'field_cataloguer_terms', 'field_ticket' ]
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
end
