class SetFileFormatsConfigOption < ActiveRecord::Migration
  def self.up
    say_with_time "Setting specific allowed upload extensions" do
      RunCoCo.configuration.allowed_upload_extensions = 'doc,pdf,txt,jpg,jpeg,jp2,jpx,gif,png,tiff,mp3,ogg,ogv,webm,mp4,avi,mpg,zip'
      RunCoCo.configuration.save
    end
  end

  def self.down
    say_with_time "Reverting to all allowed upload extensions" do
      RunCoCo.configuration.allowed_upload_extensions = ''
      RunCoCo.configuration.save
    end
  end
end
