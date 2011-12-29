class Admin::ConfigController < AdminController
  # GET /admin/config
  def index
    @config = CoCoCo.configuration
  end
  
  # GET /admin/config/edit
  def edit
    @config = CoCoCo.configuration
  end

  # PUT /admin/config  
  def update
    settings = process_from_form(params[:settings])
    @config = CoCoCo::Configuration.new
    
    settings.each_pair do |key, value|
      name = key.to_sym
      begin
        @config[name] = value
      rescue ArgumentError # Ignore attempts to set unknown settings.
      end
    end
    
    if @config.save
      CoCoCo.configuration.load
      flash[:notice] = t('flash.configuration.update.notice')
      redirect_to admin_config_path
    else
      flash.now[:alert] = t('flash.configuration.update.alert')
      render :action => 'edit'
    end
  end

  protected
  def authorize!
    current_user.may_administer_settings!
  end
  
  def process_from_form(settings)
    settings[:ui_locales].delete('')
    settings
  end
end
