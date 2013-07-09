# encoding: utf-8
class SearchSuggestionsController < ApplicationController
  def query
    query = params[:term]
    
    # Do not make suggestions beneath a minimum length
    words = if query.blank? || query.length < SearchSuggestion.min_word_length
      []
    elsif RunCoCo.configuration.search_engine == :solr
      solr_words(query)
    else
      active_record_words(query)
    end
    
    respond_to do |format|
      format.json { render :json => words }
    end
  end
  
  private
  def active_record_words(query) # :nodoc:
    suggestions = SearchSuggestion.where("text LIKE '#{query}%'").order('frequency DESC').limit(SearchSuggestion.max_matches)
    
    suggestions.reject! { |sugg| sugg.text.blank? }
    
    suggestions.collect do |sugg|
      label = sugg.text.truncate(30 + query.length, :separator => ' ', :omission => '…')
      { :value => sugg.text, :label => "#{label} (#{sugg.frequency})"}
    end
  end
  
  ##
  # Uses Solr TermsComponent to get suggestions.
  #
  def solr_words(query) # :nodoc:
    text_field_index_names = Sunspot::Setup.for(Contribution).all_text_fields.collect do |text_field|
      text_field.indexed_name
    end
    text_field_query_params = text_field_index_names.collect do |text_field_name|
      'terms.fl=' + text_field_name
    end
    
    query_params = text_field_query_params.join('&') + 
     '&terms.sort=index&count=50&wt=json&indent=on' +
     '&terms.prefix=' + URI.encode(query)
    uri = Sunspot.config.solr.url + '/terms?' + query_params

    response = JSON::parse(Net::HTTP.get(URI(uri)))

    term_freqs = {}
    response['terms'].values.each do |field_terms_and_freqs| 
      field_terms_and_freqs.each_index do |i|
        if i % 2 == 1
          term = field_terms_and_freqs[i - 1]
          freq = field_terms_and_freqs[i]
          if term_freqs.has_key?(term)
            term_freqs[term] = term_freqs[term] + freq
          else
            term_freqs[term] = freq
          end
        end
      end
    end
    
    words = term_freqs.sort { |a1, a2| a2[1] <=> a1[1] }.collect do |a|
      label = a.first.truncate(30 + query.length, :separator => ' ', :omission => '…')
      { :label => "#{label} (#{a.last})", :value => a.first }
    end.slice(0, SearchSuggestion.max_matches)
  end
  
  def sphinx_words(query) # :nodoc:
    SearchSuggestion.search(query, :match_mode => :phrase, :order => :frequency, :sort_mode => :desc).collect do |ss|
      ss.text
    end
  end
end
