class SetGmapApiKey < ActiveRecord::Migration
  
  def self.up
    say_with_time "Updating to new v3 key" do
      RunCoCo.configuration.gmap_api_key = 'AIzaSyARYUuCXOrUv11afTLg72TqBN2n-o4XmCI'
      RunCoCo.configuration.save
    end
  end

  def self.down
    say_with_time "Reverting to old api v2 key" do
      RunCoCo.configuration.gmap_api_key = 'ABQIAAAAfIoUsRWAPXSvMome-5BtMhRjy2fXKCpHHrvMdzVe7IzGpJu3CRSwmDczw5y9mEPCjPRycB4JYVb1Tw'
      RunCoCo.configuration.save
    end
  end
end
