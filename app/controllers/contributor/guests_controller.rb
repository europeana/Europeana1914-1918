class Contributor::GuestsController < ApplicationController
  # GET /contributor/guest/new
  def new
    if session[:guest] && session[:guest].has_key?(:contact_id)
      redirect_to :action => :edit
      return
    end
    current_user.may_create_guest_contact!
    @contact = Guest.new
  end
  
  # POST /contributor/guest
  def create
    current_user.may_create_guest_contact!
    @contact = Guest.create(params[:guest])
    if @contact.save
      session[:guest][:contact_id] = @contact.id
      flash[:notice] = t('flash.guest_contact.create.notice')
      redirect_to contributor_dashboard_path
    else
      flash.now[:alert] = t('flash.guest_contact.create.alert')
      render :action => 'new'
    end
  end
  
  # GET /contributor/guest/edit
  def edit
    current_user.may_edit_guest_contact!
    if session[:guest].present? && session[:guest].has_key?(:contact_id)
      @contact = Contact.find(session[:guest][:contact_id])
    else
      redirect_to :action => :new
    end
  end
  
  # PUT /contributor/guest
  def update
    if session[:guest].present? && session[:guest].has_key?(:contact_id)
      @contact = Contact.find(session[:guest][:contact_id])
      if @contact.update_attributes(params[:guest])
        flash[:notice] = t('flash.guest_contact.update.notice')
        redirect_to contributor_dashboard_path
      else
        flash.now[:alert] = t('flash.guest_contact.update.alert')
        render :action => 'edit'
      end
    else
      raise RunCoCo::BadRequest
    end
  end
  
  # PUT /contributor/guest/forget
  def forget
    if session[:guest].present? && session[:guest].has_key?(:contact_id)
      session[:guest].delete(:contact_id)
      flash[:notice] = t('flash.guest_contact.forget.notice')
      redirect_to home_path
    else
      raise RunCoCo::BadRequest
    end
  end
end
