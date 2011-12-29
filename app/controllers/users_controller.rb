class UsersController < ApplicationController
  before_filter :authenticate_user!

  # GET /users/account
  # Displays account details for logged in user
  def account
  end
end
