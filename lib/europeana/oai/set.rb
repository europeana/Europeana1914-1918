module Europeana
  module OAI
    class Set < ::OAI::Set
      undef_method :description
    end
  end
end
