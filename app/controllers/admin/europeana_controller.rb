class Admin::EuropeanaController < AdminController
  # GET /admin/europeana
  def index
    
  end
  
  # PUT /admin/europeana/harvest
  def harvest
    Delayed::Job.enqueue EuropeanaHarvestJob.new, :queue => 'europeana_harvest'
    flash[:notice] = I18n.t('flash.admin.europeana.harvest.notice')
    redirect_to admin_root_path
  end
  
protected

  def authorize!
    current_user.may_harvest_europeana!
  end
end
