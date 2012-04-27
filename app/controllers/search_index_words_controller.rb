class SearchIndexWordsController < ApplicationController
  def suggest
    query = params[:q]
    
    # Do not make suggestions on less than 3 characters
    words = if query.blank? || query.length < 3 
      []
    else
      SearchIndexWord.search(query, :match_mode => :phrase).reject { |word| word.blank? }.collect { |word| word.text }
    end
    
    respond_to do |format|
      format.json { render :json => words }
    end
  end
end
