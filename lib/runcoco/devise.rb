# Customise Devise database authentication to allow login by username *or* email

require 'devise/strategies/authenticatable'

module Devise
  module Models
    module Authenticatable
      module ClassMethods
        def find_for_authentication(conditions)
          if conditions["username"].blank? && conditions["email"].present?
            conditions.delete("username")
          elsif conditions["email"].blank? && conditions["username"].present?
            conditions.delete("email")
          end
          filter_auth_params(conditions)
          find(:first, :conditions => conditions)
        end
      end
    end
  end

  module Strategies
    class DatabaseAuthenticatable < Authenticatable
      def with_authentication_hash(hash)
        self.authentication_hash = hash.slice(*authentication_keys)
        self.password = hash[:password]
        authentication_keys.any?{ |k| authentication_hash[k].present? }
      end
    end
  end
end
