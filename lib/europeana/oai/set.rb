module Europeana
  module OAI
    class Set < ::OAI::Set
      undef_method :description
      
      def initialize(values = {})
        super
        @name = 'Stories'
        @spec = 'story'
      end
    end
  end
end
