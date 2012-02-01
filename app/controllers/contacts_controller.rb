class ContactsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :find_contact

  # GET /contacts/:id
  def show
    current_user.may_view_contact!(@contact)
  end

  # GET /contacts/:id/edit
  def edit
    current_user.may_edit_contact!(@contact)
  end

  # PUT /contacts/:id
  def update
    current_user.may_edit_contact!(@contact)

    if params[:delete_picture] && !params[:contact][:user_attributes][:picture] && @contact.user && @contact.user.picture.present?
      @contact.user.picture.destroy
    end

    @contact.attributes = params[:contact]
    if @contact.save
      flash[:notice] = t('flash.contacts.update.notice')
      redirect_to @contact
    else
      flash.now[:alert] = t('flash.contacts.update.alert')
      render :action => 'edit'
    end
  end

  protected
  def find_contact
    @contact = Contact.find(params[:id])
  end
end
