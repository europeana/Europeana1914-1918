class HttpController < ApplicationController
  # GET /http-headers
  def headers
    url = URI.parse(params[:url])
    response = nil
    Net::HTTP.start(url.host, url.port) { |http|
      path = url.path
      if url.query.present?
        path = url + '?' + url.query
      end
      response = http.head(path)
    }

    respond_to do |format|
      format.json do
        render :json => response
      end
    end
  end
end
