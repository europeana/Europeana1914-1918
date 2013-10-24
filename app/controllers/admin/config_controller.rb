class Admin::ConfigController < AdminController
  # GET /admin/config
  def index
    @config = RunCoCo.configuration
  end
  
  # GET /admin/config/edit
  def edit
    @config = RunCoCo.configuration
  end

  # PUT /admin/config  
  def update
    settings = process_from_form(params[:settings])
    @config = RunCoCo.configuration
    
    settings.each_pair do |key, value|
      name = key.to_sym
      begin
        @config[name] = value
      rescue ArgumentError # Ignore attempts to set unknown settings.
      end
    end
    
    if @config.save
      if RunCoCo::Application.config.action_controller.perform_caching && RunCoCo::Application.config.action_controller.cache_classes
        Rails.cache.write("runcoco.configuration", @config.to_array)
      end
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
