# Duplicates functionality of Devise's RegistrationsController
# which can not be readily sub-classed pre v1.1
class Admin::UsersController < AdminController
  before_filter :find_user, :except => [ :index, :new, :create, :export ]
  
  # GET /admin/users
  def index
    @role, @sort, @order, @query = params[:role], params[:sort], params[:order], params[:q]
    
    order_col = case @sort
    when 'name'
      'contacts.full_name'
    when 'username'
      'users.username'
    when 'email'
      'users.email'
    else
      'users.created_at'
    end
    order_dir = (@order.present? && [ 'ASC', 'DESC' ].include?(@order.upcase)) ? @order : 'DESC'
    
    @users = User.includes(:contact).order("#{order_col} #{order_dir}").paginate(:page => params[:page])
    
    if @role.present?
      @users = @users.where(:role_name => @role )
    end
    
    if @query.present?
      wildcard_query = "%#{@query}%"
      @users = @users.where("(users.username LIKE ? OR contacts.full_name LIKE ? OR users.email LIKE ?)", wildcard_query, wildcard_query, wildcard_query)
    end
  end

  # GET /admin/users/new
  def new
    @user = User.new
  end

  # POST /admin/users
  def create
    @user = User.new
    [ :role_name, :institution_id ].each do |attribute|
      if params[:user].has_key?(attribute)
        @user.send("#{attribute.to_s}=", params[:user].delete(attribute))
      end
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
    [ :role_name, :institution_id ].each do |attribute|
      if params[:user].has_key?(attribute)
        @user.send("#{attribute.to_s}=", params[:user].delete(attribute))
      end
    end
    
    if params[:delete_picture] && !params[:user][:contact_attributes][:user_attributes][:picture] && @user.picture.present?
      @user.picture.destroy
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

  # GET /admin/users/export(.:format)
  def export
    current_user.may_administer_users!
    
    timestamp = Time.now.strftime('%Y%m%d%H%M%S')
    
    respond_to do |format|
      format.csv do
        send_data export_as_csv, :filename => "users-#{timestamp}.csv", :type => 'text/csv'
      end
    end
  end
  
  def index_params(override_params = {})
    index_params = HashWithIndifferentAccess.new
    [ 'sort', 'role', 'order', 'q' ].each do |key|
      index_params[key] = params[key]
    end
    index_params.merge!(override_params)
    
    if (params['sort'] || 'created_at') == override_params['sort']
      index_params['order'] = (params['order'].blank? || (params['order'].upcase == 'DESC') ? 'ASC' : 'DESC')
    end
    
    index_params
  end
  helper_method :index_params

  protected
  def find_user
    @user = User.find(params[:id])
  end

  def authorize!
    current_user.may_administer_users!
  end
  
  def export_as_csv
    contributors = User.includes(:contact).where(:role_name => 'contributor').where("(SELECT COUNT(id) FROM contributions WHERE contributor_id=users.id) > 0")
    
    csv_class.generate do |csv|
      # Column headings in first row
      attributes = [ 
        :id, :username, :email, :full_name, :street_address, :locality, 
        :region, :postal_code, :country, :tel, :email, :gender, :age, :url ]
      csv << attributes.collect { |attribute| Contribution.human_attribute_name(attribute) }

      contributors.each do |u|
        c = u.contact
        csv << [ u.id, u.username, u.email, c.full_name, c.street_address, c.locality, c.region, c.postal_code, c.country, c.tel, c.email, c.gender, c.age, admin_user_url(u) ]
      end
    end
  end
end

