# set search result defaults in the methods
#   def search
#   def search_by_taxonomy
class ContributionsController < ApplicationController
  before_filter :find_contribution, 
    :except => [ :index, :new, :create, :search, :search_by_taxonomy_term, :complete ]

  # GET /contributions
  def index
    if RunCoCo.configuration.publish_contributions?
      search
    else
      @contributions = []
    end
  end

  # GET /contributions/new
  def new
    current_user.may_create_contribution!
    @contribution = Contribution.new
    if current_user.may_catalogue_contributions? && @contribution.catalogued_by.blank?
      @contribution.catalogued_by = current_user.id
    end
  end

  # POST /contributions
  def create
    if (current_user.role.name == 'guest') && !RunCoCo.configuration.registration_required?
      if session[:guest][:contribution_id].present?
        redirect_to edit_contribution_path(session[:guest][:contribution_id])
        return
      elsif session[:guest][:contact_id].blank?
        redirect_to new_contributor_guest_path
        return
      end
    end
    current_user.may_create_contribution!
    
    @contribution = Contribution.new 
    if current_user.may_catalogue_contributions?
      @contribution.catalogued_by = params[:contribution].delete(:catalogued_by)
    end
    @contribution.attributes = params[:contribution]

    if current_user.role.name == 'guest'
      @contribution.guest = current_user.contact
    else
      @contribution.contributor = current_user
    end
    
    if @contribution.save
      if current_user.role.name == 'guest'
        session[:guest][:contribution_id] = @contribution.id
      end
      flash[:notice] = t('flash.contributions.draft.create.notice')
      redirect_to new_contribution_attachment_path(@contribution)
    else
      RunCoCo.error_logger.debug("Contribution creation failed: #{@contribution.errors.inspect}")
      flash[:alert] = t('flash.contributions.draft.create.alert')
      render :action => 'new'
    end
  end

  # GET /contributions/:id
  def show
    current_user.may_view_contribution!(@contribution)
    if @contribution.draft? && current_user.may_edit_contribution?(@contribution)
      redirect_to edit_contribution_path(@contribution)
    end
  end
  
  # GET /contributions/:id/status_log
  def status_log
    current_user.may_view_contribution_status_log!(@contribution)
  end

  # GET /contributions/:id/edit
  def edit
    current_user.may_edit_contribution!(@contribution)
    
    if current_user.may_catalogue_contributions?
      @contribution.metadata.cataloguing = true
      if @contribution.catalogued_by.blank?
        @contribution.catalogued_by = current_user.id
      end
    end
  end

  # PUT /contributions/:id
  def update
    current_user.may_edit_contribution!(@contribution)

    if current_user.may_catalogue_contributions? && @contribution.catalogued_by.blank?
      @contribution.catalogued_by = params[:contribution].delete(:catalogued_by)
    end
    @contribution.attributes = params[:contribution]
    if current_user.may_catalogue_contributions?
      @contribution.metadata.cataloguing = true
    end

    if @contribution.save
      # Updates made by non-cataloguers change the contribution's status to
      # :revised
      if !current_user.may_catalogue_contributions? && (@contribution.status == :approved)
        @contribution.change_status_to(:revised, current_user.id)
      end
      flash[:notice] = t('flash.contributions.draft.update.notice')
      redirect_to (@contribution.draft? ? new_contribution_attachment_path(@contribution) : @contribution)
    else
      flash.now[:alert] = t('flash.contributions.draft.update.alert')
      render :action => 'edit'
    end
  end
  
  # PUT /contributions/:id/submit
  def submit
    current_user.may_edit_contribution!(@contribution)
    if @contribution.submit
      if current_user.role.name == 'guest'
        session[:guest].delete(:contribution_id)
      end
      redirect_to complete_contributions_url
    else
      flash.now[:alert] = t('flash.contributions.draft.submit.alert')
    end
  end
  
  # PUT /contributions/:id/approve
  def approve
    current_user.may_approve_contributions!
    if @contribution.approve_by(current_user)
      email = @contribution.by_guest? ? @contribution.contact.email : @contribution.contributor.email
      if email.present?
        ContributionsMailer.published(email, @contribution).deliver
      end
      flash[:notice] = t('flash.contributions.approve.notice')
      redirect_to admin_contributions_url
    else
      @show_errors = true
      flash.now[:alert] = t('flash.contributions.approve.alert')
      render :action => 'show'
    end
  end
  
  # PUT /contributions/:id/reject
  def reject
    current_user.may_reject_contributions!
    if @contribution.reject_by(current_user)
      flash[:notice] = t('flash.contributions.reject.notice')
      redirect_to admin_contributions_url
    else
      @show_errors = true
      flash.now[:alert] = t('flash.contributions.reject.alert')
      render :action => 'show'
    end
  end
  
  # GET /contributions/search
  def search
    current_user.may_search_contributions!
    @query = params[:q]
    search_options = { :page => params[:page], :per_page => (params[:count] || 48) }
    @contributions = search_contributions(:published, @query, search_options)
  end
  
  # GET /explore/:field_name/:term
  def search_by_taxonomy_term
    current_user.may_search_contributions!
    field = MetadataField.find_by_name!(params[:field_name])
    if term = field.taxonomy_terms.find_by_term(params[:term])
      search_options = { :taxonomy_term => term, :page => params[:page], :per_page => (params[:count] || 48) }
      @contributions = search_contributions(:published, nil, search_options)
    else
      @contributions = []
    end
    @term = params[:term]
    render :action => 'search'
  end
  
  # GET /contributions/:id/delete
  def delete
    current_user.may_delete_contribution!(@contribution)
  end

  # DELETE /contributions/:id
  def destroy
    current_user.may_delete_contribution!(@contribution)
    if @contribution.destroy
      if current_user.role.name == 'guest'
        session[:guest].delete(:contribution_id)
      end
        
      flash[:notice] = t('flash.contributions.destroy.notice')
      redirect_to ((current_user.role.name == 'administrator') ? admin_contributions_url : contributor_dashboard_url)
    else
      flash.now[:alert] = t('flash.contributions.destroy.alert')
      render :action => 'delete'
    end
  end
  
  # GET /contributions/:id/withdraw
  def withdraw
    current_user.may_withdraw_contribution!(@contribution)
  end
  
  # PUT /contributions/:id/withdraw
  def set_withdrawn
    current_user.may_withdraw_contribution!(@contribution)
    if @contribution.change_status_to(:withdrawn)
      flash[:notice] = t('flash.contributions.withdraw.notice')
      redirect_to contributor_dashboard_url
    else
      flash.now[:alert] = t('flash.contributions.withdraw.alert')
      render :action => 'withdraw'
    end
  end

  protected
  def find_contribution
    @contribution = Contribution.find(params[:id], :include => [ :contributor, :attachments, :metadata ])
  end
end

