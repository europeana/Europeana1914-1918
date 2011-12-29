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
end
