# Duplicates functionality of Devise's RegistrationsController
# which can not be readily sub-classed pre v1.1
class Admin::UsersController < AdminController
  before_filter :find_user, :except => [ :index, :new, :create ]
  
  # GET /admin/users
  # TODO: Search user list
  # TODO: Sort user list
  def index
    @role = params[:role]
    conditions = @role.present? ? [ 'role_name=?', params[:role] ] : nil
    @users = User.where(conditions).order('email ASC').paginate(:page => params[:page])
  end

  # GET /admin/users/new
  def new
    @user = User.new
  end

  # POST /admin/users
  def create
    @user = User.new
    if params[:user].has_key?(:role_name)
      @user.role_name = params[:user].delete(:role_name)
    end
    @user.attributes = params[:user]
    if @user.save
      flash[:notice] = t('flash.users.create.notice')
      redirect_to admin_users_path
    else
      flash.now[:alert] = t('flash.users.create.alert')
      render :action => 'new'
    end
  end

  # GET /admin/users/:id
  def show
  end

  # GET /admin/users/:id/edit
  def edit
  end

  # GET /admin/users/:id/delete
  def delete
    @user = User.find(params[:id])
  end

  # PUT /admin/users/:id
  def update
    @user = User.find(params[:id])
    [ :password, :password_confirmation ].each { |key| params[:user].delete(key) unless params[:user][key].present? }
    if params[:user].has_key?(:role_name)
      @user.role_name = params[:user].delete(:role_name)
    end
    @user.attributes = params[:user]
    if @user.save
      flash[:notice] = t('flash.users.update.notice')
      redirect_to admin_users_path
    else
      flash.now[:alert] = t('flash.users.update.alert')
      render :action => 'edit'
    end
  end

  # DELETE /admin/users/:id
  def destroy
    @user = User.find(params[:id]).destroy
    flash[:notice] = t('flash.users.destroy.notice')
    redirect_to admin_users_path
  end

  protected
  def find_user
    @user = User.find(params[:id])
  end

  def authorize!
    current_user.may_administer_users!
  end
end

