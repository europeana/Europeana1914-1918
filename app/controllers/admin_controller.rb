class AdminController < ApplicationController
  before_filter :authenticate_user!
  before_filter :authorize!

  def index
  end

  protected
  def authorize!
    current_user.may_access_admin_area!
  end
end

