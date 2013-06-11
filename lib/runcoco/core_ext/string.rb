class String
  ##
  # Appends a wildcard character to the string unless already present.
  #
  # @param [String] wildcard Wildcard character, defaults to '*'
  # @return [String] String with wildcard appended
  #
  def append_wildcard(wildcard = '*')
    self + (self.last == wildcard ? '' : wildcard)
  end
  
  ##
  # Adds quote marks around the string.
  #
  # @param [String] quote_mark Quote mark character, defaults to '"'.
  # @return [String] Quoted version of passed string(s).
  #
  def add_quote_marks(quote_mark = '"')
    quote_mark + self + quote_mark
  end
end
