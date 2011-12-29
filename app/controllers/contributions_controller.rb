class ContributionsController < ApplicationController
  before_filter :find_contribution, :except => [ :index, :new, :create, :search, :complete ]

  # GET /contributions
  def index
    if CoCoCo.configuration.publish_contributions?
      search
    else
      @contributions = []
    end
  end

  # GET /contributions/new
  def new
    current_user.may_create_contribution!
    @contribution = Contribution.new
  end

  # POST /contributions
  def create
    if (current_user.role.name == 'guest') && !CoCoCo.configuration.registration_required?
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
    @contribution.terms = params[:contribution][:terms]

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
      redirect_to edit_contribution_url(@contribution)
    else
      flash[:alert] = t('flash.contributions.draft.create.alert')
      render :action => 'new'
    end
  end

  # GET /contributions/:id
  def show
    current_user.may_view_contribution!(@contribution)
    # Show error messages
    @contribution.submitting = true unless @contribution.submitted?
  end

  # GET /contributions/:id/edit
  def edit
    if @contribution.submitted? && (@contribution.contributor == current_user)
      unless current_user.may_catalogue_contributions?
        flash[:alert] = t('flash.contributions.submitted.edit.alert')
        redirect_to @contribution
        return
      end
    end
    current_user.may_edit_contribution!(@contribution)
    
    # Enable validation_reflection
    @contribution.submitting = true 
    @contribution.metadata.validating = true
  end

  # PUT /contributions/:id
  def update
    current_user.may_edit_contribution!(@contribution)

    @contribution.metadata.cataloguing = true if current_user.may_catalogue_contribution?(@contribution)
    @contribution.attributes = params[:contribution]  

    if @contribution.save
      flash[:notice] = t('flash.contributions.draft.update.notice')
      redirect_to @contribution
    else
      flash.now[:alert] = t('flash.contributions.draft.update.alert')
      render :action => 'edit'
    end
  end
  
  # PUT /contributions/:id/submit
  def submit
    current_user.may_edit_contribution!(@contribution)
    @contribution.submitting = true
    if @contribution.save
      if current_user.role.name == 'guest'
        session[:guest].delete(:contribution_id)
      end
      redirect_to complete_contributions_url
    else
      flash.now[:alert] = t('flash.contributions.draft.submit.alert')
      render :action => 'show'
    end
  end
  
  # PUT /contributions/:id/approve
  def approve
    current_user.may_approve_contributions!
    if @contribution.approve_by(current_user)
      flash[:notice] = t('flash.contributions.approve.notice')
      redirect_to admin_contributions_url
    else
      flash.now[:alert] = t('flash.contributions.approve.alert')
      render :action => 'show'
    end
  end
  
  # GET /contributions/search
  def search
    current_user.may_search_contributions!

    @query = params[:q]
    if @query.present?
      star_query = @query + (@query.last == '*' ? '' : '*')
      @contributions = search_contributions(:published, star_query, :page => params[:page], :per_page => 10)
    else
      @contributions = Contribution.where('approved_at IS NOT NULL').paginate(:page => params[:page], :per_page => 10)
    end
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

  protected
  def find_contribution
    @contribution = Contribution.find(params[:id], :include => [ :contributor, :attachments, :metadata ])
  end
end

