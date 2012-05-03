class SearchIndexWordsController < ApplicationController
  def suggest
    query = params[:q]
    
    # Do not make suggestions beneath a minimum length
    words = if query.blank? || query.length < SearchIndexWord::MIN_WORD_LEN
      []
    else
      results = SearchIndexWord.where("text LIKE '#{query}%'").order('frequency DESC').limit(SearchIndexWord::MAX_MATCHES)
#      results = SearchIndexWord.search(query, :match_mode => :phrase, :order => :frequency, :sort_mode => :desc)
      results.reject { |word| word.blank? }.collect { |word| word.text }
    end
    
    respond_to do |format|
      format.json { render :json => words }
    end
  end
end
