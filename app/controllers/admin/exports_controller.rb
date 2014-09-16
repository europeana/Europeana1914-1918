class Admin::ExportsController < AdminController
  def index
    @exports = Export.all
  end
  
  def show
    @export = Export.find(params[:id])
    
    if @export.file.options[:storage] == :s3
      tmp_file = Tempfile.new('paperclip-s3')
      @export.file.copy_to_local_file(:original, tmp_file.path)
      tmp_file.close unless tmp_file.closed?
      file_path = tmp_file.path
    else
      file_path = @export.file.path
    end
    
    send_file file_path, 
      :type => @export.file.content_type,
      :filename => File.basename(@export.file.path)
  end

protected

  def authorize!
    current_user.may_administer_contributions!
  end
end
