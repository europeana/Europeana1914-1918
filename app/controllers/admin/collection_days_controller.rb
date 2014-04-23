class Admin::CollectionDaysController < AdminController
  before_filter :find_collection_day, :except => [ :index, :new ]
  def index
    @collection_days = CollectionDay.paginate(:page => params[:page] || 1)
  end
  
  def new
    @collection_day = CollectionDay.new
  end
  
  def create
    @collection_day = CollectionDay.new(params[:collection_day])
    if @collection_day.save
      redirect_to admin_collection_days_path
    else
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
      redirect_to admin_collection_days_path
    else
      render :action => :edit
    end
  end
  
  def delete
  
  end
  
  def destroy
  
  end
  
protected

  def authorize!
    current_user.may_administer_metadata_fields!
  end
  
  def find_collection_day
    @collection_day = CollectionDay.find(params[:id])
  end
end
