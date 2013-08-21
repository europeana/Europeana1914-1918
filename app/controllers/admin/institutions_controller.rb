class Admin::InstitutionsController < AdminController
  
  # GET /:locale/admin/institutions
  def index
    @institutions = Institution.all
  end
  
  # GET /:locale/admin/institutions/new
  def new
    @institution = Institution.new
  end
  
  # POST /:locale/admin/institutions
  def create
    @institution = Institution.new(params[:institution])
    if @institution.save
      flash[:notice] = t('flash.users.create.notice')
      redirect_to admin_institutions_path
    else
      flash.now[:alert] = t('flash.users.create.alert')
      render :action => 'new'
    end
  end
  
  # GET /:locale/admin/institutions/:id/edit
  def edit
    @institution = Institution.find(params[:id])
  end
  
  # PUT /:locale/admin/institutions/:id
  def update
    @institution = Institution.find(params[:id])
    @institution.attributes = params[:institution]
    if @institution.save
      flash[:notice] = t('flash.users.update.notice')
      redirect_to admin_institutions_path
    else
      flash.now[:alert] = t('flash.users.update.alert')
      render :action => 'edit'
    end
  end
  
  # GET /:locale/admin/institutions/:id/delete
  def delete
    @institution = Institution.find(params[:id])
  end
  
  # DELETE /:locale/admin/institutions/:id
  def destroy
    @institution = Institution.find(params[:id])
    if @institution.destroy
      flash[:notice] = t('flash.users.destroy.notice')
      redirect_to admin_institutions_path
    else
      flash.now[:alert] = t('flash.users.destroy.alert')
      render :action => 'delete'
    end
  end

protected

  def authorize!
    current_user.may_administer_institutions!
  end
end
