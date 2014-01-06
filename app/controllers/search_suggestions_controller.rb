# encoding: utf-8
class SearchSuggestionsController < ApplicationController
  # GET /suggest.json
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
    suggestions = SearchSuggestion.where([ "text LIKE ?", "#{query}%" ]).order('frequency DESC').limit(SearchSuggestion.max_matches)
    
    suggestions.reject! { |sugg| sugg.text.blank? }
    
    suggestions.collect do |sugg|
      label = sugg.text.truncate(30 + query.length, :separator => ' ', :omission => '…')
      { :value => sugg.text, :label => "#{label} (#{sugg.frequency})"}
    end
  end
  
  ##
  # Uses custom Solr searchComponents to get suggestions.
  #
  def solr_words(query) # :nodoc:
    suggesters = [
      {
        :path   => "suggestTitle",
        :field  => :title,
        :label  => t('attributes.title')
      },
      {
        :path   => "suggestAlternative",
        :field  => :metadata_alternative,
        :label  => t('formtastic.labels.contribution.metadata.alternative')
      },
      {
        :path   => "suggestTaxonomy",
        :field  => :taxonomy_terms,
        :label  => t('formtastic.labels.contribution.metadata.keywords')
      }
      
      #,
      #{
      #  :path   => "suggestProtagonists",
      #  :field  => :protagonist_names,
      #  :label  => t('views.search.facets.contributions.protagonist_names')
      #}
    ]
    query_params = {
      "q" => query,
      "wt" => "xml",
      "spellcheck.maxCollations" => 10,
      "spellcheck.collate" => true,
      "spellcheck.maxCollationTries" => 5
    }
    term_freqs = []
    
    suggesters.each do |suggester|
      uri = URI.parse(Sunspot.config.solr.url + "/#{suggester[:path]}")
      uri.query = query_params.to_query

      doc = Nokogiri::XML(Net::HTTP.get(uri))
      suggestions = doc.css("lst[name=collation]")

      suggestions.each do |suggestion|
        term = suggestion.css('*[name=collationQuery]').text
        freq = suggestion.css('*[name=hits]').text
        term_freqs << {
          :term => term,
          :freq => freq,
          :suggester => suggester
        }
      end
    end
    
    words = []
    term_freqs.sort { |a, b| b[:freq].to_i <=> a[:freq].to_i }.each do |suggestion|
      label = suggestion[:term].truncate(30 + query.length, :separator => ' ', :omission => '…')
      words << { 
        :label => "#{label} (#{suggestion[:freq]}) #{suggestion[:suggester][:label]}", 
        :value => suggestion[:term],
        :count => suggestion[:freq],
        :field => suggestion[:suggester][:field]
      }
    end
    
    words.slice(0, SearchSuggestion.max_matches)
  end
  
  def sphinx_words(query) # :nodoc:
    SearchSuggestion.search(query, :match_mode => :phrase, :order => :frequency, :sort_mode => :desc).collect do |ss|
      ss.text
    end
  end
end
