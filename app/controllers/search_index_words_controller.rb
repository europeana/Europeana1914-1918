class SearchIndexWordsController < ApplicationController
  def suggest
    query = params[:q]
    
    words = if query.blank? || query.length < ThinkingSphinx::Configuration.instance.index_options[:min_prefix_len]
      []
    else
      wildcard_query = query + '*'
      SearchIndexWord.search(wildcard_query).reject { |word| word.blank? }.collect { |word| word.text }
    end
    
    respond_to do |format|
      format.json { render :json => words }
    end
  end
end
