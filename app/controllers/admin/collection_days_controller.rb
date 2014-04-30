class Admin::CollectionDaysController < AdminController
  before_filter :find_collection_day, :except => [ :index, :new, :create ]
  def index
    @collection_days = CollectionDay.paginate(:page => params[:page] || 1)
  end
  
  def new
    @collection_day = CollectionDay.new
  end
  
  def create
    @collection_day = CollectionDay.new(params[:collection_day])
    if @collection_day.save
      flash[:notice] = t('flash.actions.create.notice', :resource_name => t('activerecord.models.collection_day'))
      redirect_to admin_collection_days_path
    else
      flash.now[:alert] = t('flash.actions.create.alert', :resource_name => t('activerecord.models.collection_day'))
      render :action => :new
    end
  end
  
  def show
  end
  
  def edit
  end
  
  def update
    @collection_day.attributes = params[:collection_day]
    if @collection_day.save
      flash[:notice] = t('flash.actions.update.notice', :resource_name => t('activerecord.models.collection_day'))
      redirect_to admin_collection_days_path
    else
      flash.now[:alert] = t('flash.actions.update.alert', :resource_name => t('activerecord.models.collection_day'))
      render :action => :edit
    end
  end
  
  def delete
  end
  
  def destroy
    if @collection_day.destroy
      flash[:notice] = t('flash.actions.destroy.notice', :resource_name => t('activerecord.models.collection_day'))
      redirect_to admin_collection_days_path
    else
      flash.now[:alert] = t('flash.actions.destroy.alert', :resource_name => t('activerecord.models.collection_day'))
      render :action => :delete
    end
  end
  
protected

  def authorize!
    current_user.may_administer_metadata_fields!
  end
  
  def find_collection_day
    @collection_day = CollectionDay.find(params[:id])
  end
end
