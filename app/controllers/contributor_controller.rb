class ContributorController < ApplicationController
  
  def dashboard
    
    if current_user.role.name == 'guest'
      RunCoCo.configuration.registration_required? ? registration_required : dashboard_guest
    else
      dashboard_contributor
    end
    
  end
  
  
  def dashboard_contributor
    search_options = { :page => params[:page], :contributor_id => current_user.id }
  
    @contributions = {
      :draft      => Contribution.search(:draft, @query, search_options).results,
      :submitted  => Contribution.search(:submitted, @query, search_options).results,
      :approved   => Contribution.search(:approved, @query, search_options).results,
      :revised    => Contribution.search(:revised, @query, search_options).results,
      :withdrawn  => Contribution.search(:withdrawn, @query, search_options).results,
      :rejected   => Contribution.search(:rejected, @query, search_options).results,
    }
    
    @total = @contributions.inject(0) { |sum, set| sum + set.size }
    
    render :action => 'dashboard_contributor'
  end
  
  
  def dashboard_guest
    
    if current_user.contact.present?
      if session[:guest][:contribution_id].present?
        redirect_to edit_contribution_path(session[:guest][:contribution_id])
      else
        @contribution = Contribution.new
        render :action => 'dashboard_guest'
      end
    else
      redirect_to new_contributor_guest_path
    end
    
  end
  
  
  def registration_required
    render :action => 'registration_required'
  end
  
end

