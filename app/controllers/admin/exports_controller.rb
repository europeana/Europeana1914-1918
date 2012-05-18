class Admin::ExportsController < AdminController
  def index
    @exports = export_file_names.sort
  end
  
  def show
    raise ActionController::RoutingError unless export_file_names.include?(params[:id])
    export_file_path = File.join(Rails.root, 'private', 'exports', params[:id])
    send_file export_file_path, :type => MIME::Types.type_for(params[:id]).first.to_s
  end

  protected
  def authorize!
    current_user.may_administer_contributions!
  end
  
  def export_file_paths
    Dir.glob(File.join(Rails.root, 'private', 'exports', '*'))
  end
  
  def export_file_names
    export_file_paths.collect { |path| File.basename(path) }
  end
end
