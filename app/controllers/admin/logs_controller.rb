class Admin::LogsController < AdminController
  # GET /admin/logs
  def index
    @logs = log_file_names.sort
  end

  # GET /admin/logs/:id
  def show
    raise ActionController::RoutingError unless log_file_names.include?(params[:id])
    @log_file_name = params[:id]
    log_lines = []
    File.open(File.join(Rails.root, 'log', params[:id])) do |f|
      f.each do |l|
        log_lines << l
        if log_lines.size > 100
          log_lines.shift
        end
      end
    end
    @log = log_lines.join
  end
  
  protected
  def authorize!
    current_user.may_view_logs!
  end
  
  def log_file_paths
    Dir.glob(File.join(Rails.root, 'log', '*.log'))
  end
  
  def log_file_names
    log_file_paths.collect { |l| File.basename(l) }
  end
end
