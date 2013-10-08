class Admin::ExportsController < AdminController
  def index
    @exports = Export.all
  end
  
  def show
    @export = Export.find(params[:id])
    
    send_file_method = (@export.file.options[:storage] == :s3 ? :to_file : :path)
    send_file @export.file.send(send_file_method), 
      :type => @export.file.content_type,
      :filename => File.basename(@export.file.path)
  end

protected

  def authorize!
    current_user.may_administer_contributions!
  end
end
