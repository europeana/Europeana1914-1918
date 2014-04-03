class Admin::EuropeanaController < AdminController
  class Options
    include ActiveModel::Validations
    attr_accessor :query, :limit, :start
    validates_numericality_of :limit, :allow_nil => true, :unless => Proc.new { |o| o.limit.blank? }
    validates_numericality_of :start, :allow_nil => true, :unless => Proc.new { |o| o.start.blank? }
    
    def initialize(attributes = {})
      attributes.assert_valid_keys(:query, "query", :limit, "limit", :start, "start")
      attributes.each_pair do |name, value|
        self.send(:"#{name.to_s}=", value)
      end
    end
    
    def for_job
      job_options = {}
      job_options[:query] = self.query unless self.query.blank?
      job_options[:limit] = self.limit.to_i unless self.limit.blank?
      job_options[:start] = self.start.to_i unless self.start.blank?
      job_options
    end
  end

  # GET /admin/europeana
  def index
    @options = Options.new
  end
  
  # PUT /admin/europeana/harvest
  def harvest
    @options = Options.new(params[:options])
    if @options.valid?
      Delayed::Job.enqueue Europeana::HarvestJob.new(@options.for_job), :queue => 'europeana'
      flash[:notice] = I18n.t('flash.admin.europeana.harvest.notice')
      redirect_to admin_root_path
    else
      render :action => :index
    end
  end
  
protected

  def authorize!
    current_user.may_harvest_europeana!
  end
end
