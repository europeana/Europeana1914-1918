class Admin::LogsController < AdminController
  # GET /admin/logs
  def index
    @logs = Log.order("timestamp DESC").paginate(:page => params[:page], :per_page => 20)
  end
  
protected

  def authorize!
    current_user.may_view_logs!
  end
end
