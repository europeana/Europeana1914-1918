class Array
  ##
  # Adds quote marks around each item in the array.
  #
  # @param [String] quote_mark Quote mark character, defaults to '"'.
  # @return [String] Copy of array with each element converted to a string and
  #   quoted.
  #
  def add_quote_marks(quote_mark = '"')
    self.collect do |item|
      item.to_s.add_quote_marks(quote_mark)
    end
  end
end
