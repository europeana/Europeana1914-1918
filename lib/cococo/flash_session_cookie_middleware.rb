require 'rack/utils' 
module CoCoCo
  class FlashSessionCookieMiddleware 
    def initialize(app, session_key = '_cococo_session') 
      @app = app 
      @session_key = session_key 
    end 
   
    def call(env)
      if env['HTTP_USER_AGENT'] =~ /^(Adobe|Shockwave) Flash/ 
        req = Rack::Request.new(env) 
        env['HTTP_COOKIE'] = "#{@session_key}=#{req.params[@session_key]}".freeze unless req.params[@session_key].nil? 
      end 
      @app.call(env) 
    end 
  end
end
