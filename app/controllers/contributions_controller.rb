# set search result defaults in the #search method
class ContributionsController < ApplicationController
  before_filter :find_contribution,
    :except => [ :index, :new, :create, :search, :explore, :complete, :feed ]
  before_filter :redirect_to_collection_controller, :only => [ :search, :explore ]
  before_filter :rewrite_qf_array_param_as_hash, :only => [ :search, :explore ]
  before_filter :redirect_to_search, :only => :search

  cache_sweeper :contribution_sweeper, :only => [ :create, :update, :destroy ]

  # GET /contributions
  def index
    if RunCoCo.configuration.publish_contributions?
      search
    else
      @contributions = []
    end
  end

  # GET /contributions/feed
  def feed
    count = [ (params[:count] || 20).to_i, 100 ].min # Default 20, max 100

    items = Contribution.published.order('current_statuses.updated_at DESC').limit(count) +
      ActsAsTaggableOn::Tagging.where(:context => 'tags').order('created_at DESC').limit(count) +
      Annotation.order('created_at DESC').limit(count)

    @activities = items.collect do |item|
      case item
      when Contribution
        {
          :item => item,
          :updated => item.current_status.updated_at,
          :id => url_for(item),
          :link => url_for(item),
          :image => item.attachments.cover_image
        }
      when ActsAsTaggableOn::Tagging
        {
          :item => item,
          :updated => item.created_at,
          :id => 'europeana19141918:tagging/' + item.id.to_s,
          :link => url_for(item.taggable),
          :image => ''#contribution.attachments.cover_image
        }
      when Annotation
        {
          :item => item,
          :updated => item.created_at,
          :id => 'europeana19141918:annotation/' + item.id.to_s,
          :link => item.annotatable.is_a?(Attachment) ? contribution_attachment_url(item.annotatable.contribution, item.annotatable) : url_for(item.annotatable),
          :image => '' #item.annotatable
        }
      end
    end

    @activities.sort_by! { |a| a[:updated] }
    @activities = @activities.reverse[0..(count - 1)]
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
    if current_user.may_catalogue_contributions?
      @contribution.metadata.cataloguing = true
    end

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
      redirect_to edit_contribution_path(@contribution) and return
    end

    if session[:theme] == 'v3'
      @attachments = attachments_with_books
    else
      @attachments = @contribution.attachments
      if params[:page] && params[:count]
        @attachments = @attachments.paginate(:page => params[:page], :per_page => params[:count])
      end
    end

    @tags = @contribution.visible_tags

    respond_to do |format|
      format.html
      format.json { render :json => cached(@contribution, :json) }
      format.nt { render :text => cached(@contribution, :nt) }
      format.xml { render :xml => cached(@contribution, :xml) }
    end
  end
  
  # GET /contributions/:id/status
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
    
    catalogued_by = params[:contribution].delete(:catalogued_by)
    if current_user.may_catalogue_contributions? && @contribution.catalogued_by.blank?
      @contribution.catalogued_by = catalogued_by
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
  
  # GET /contributions/:id/submittable
  def submittable
    current_user.may_edit_contribution!(@contribution)
    
    respond_to do |format|
      format.json do
        render :json => {
          :id           => @contribution.id,
          :submittable  => @contribution.ready_to_submit?
        }
      end
    end
  end

  # GET /contributions/complete
  def complete
  end

  # PUT /contributions/:id/approve
  def approve
    current_user.may_approve_contributions!
    if @contribution.approve_by(current_user)
      if @contribution.statuses.select { |s| s.to_sym == :approved }.size == 1
        email = @contribution.by_guest? ? @contribution.contact.email : @contribution.contributor.email
        if email.present?
          ContributionsMailer.published(email, @contribution).deliver
        end
      end
      flash[:notice] = t('flash.contributions.approve.notice')
      redirect_to admin_contributions_url
    else
      @show_errors = true
      flash.now[:alert] = t('flash.contributions.approve.alert')
      @attachments = @contribution.attachments.paginate(:page => params[:page], :per_page => params[:count] || 3 )
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
      @attachments = @contribution.attachments.paginate(:page => params[:page], :per_page => params[:count] || 3 )
      render :action => 'show'
    end
  end

  # GET /contributions/search?q=:q
  def search
    current_user.may_search_contributions!

    @count = per_page = [ (params[:count] || 12).to_i, 100 ].min

    # Rebuild metadata_xyz_ids facet names from abbreviated field names in params
    facet_params = {}
    extracted_facet_params.each_pair do |param_name, param_value|
      #if [ "protagonist_names", "place_name" ].include?(param_name.to_s)
      if [  "place_name" ].include?(param_name.to_s)
        facet_params[param_name] = param_value
      else
        facet_params[:"metadata_#{param_name.to_s}_ids"] = param_value
      end
    end

    search_options = { :page => params[:page] || 1, :per_page => per_page, :contributor_id => params[:contributor_id], :facets => facet_params, :field => params[:field] }

    # Uncomment for minimal eager loading of associations to optimize performance
    # when search result partials are not pre-cached.
    #search_options[:include] = [ :attachments, :metadata ]

    if params[:field_name] && params[:term]
      @term = CGI::unescape(params[:term])
      @field = MetadataField.find_by_name!(params[:field_name])

      if taxonomy_term = @field.taxonomy_terms.find_by_term(@term)
        search_options[:taxonomy_term] = taxonomy_term
      else
        search = [] # Prevent search from running if field not found
      end
    elsif params[:tag]
      if tag = ActsAsTaggableOn::Tag.find_by_name(params[:tag])
        search_options[:tag] = tag
      else
        search = []
      end
    else
      @query = params[:q]
      search_query = bing_translate(@query)
    end

    if search.nil?
      search = Contribution.search(:published, search_query, search_options)
      @results = @contributions = search.results
    else
      @results = @contributions = []
    end

    if search.respond_to?(:facets)
      # Modelled on the structure of facets returned by Europeana API
      @facets = search.facets.collect { |facet|
        facet_name = (term_field = facet.name.to_s.match(/^metadata_(.*)_ids$/)) ? term_field[1] : facet.name

        {
          "name" => facet_name,
          "label" => facet_label(facet.name),
          "fields" => facet.rows.collect { |row|
            {
              "label" => facet_row_label(facet.name, row.value),
              "search" => row.value.to_s,
              "count" => row.count
            }
          }
        }
      }
      cache_search_facets("contributions", @facets)
      preserve_params_facets("contributions", @facets)
    else
      @facets = []
    end

    if params.delete(:layout) == '0'
      render :partial => 'search/results',
        :locals => {
          :contributions => @contributions,
          :results => @results,
          :query => @query,
          :term => @term
        } and return
    end

    respond_to do |format|
      format.html { render :template => 'search/page' }
      # @todo Cache generation of EDM search result
      format.json do
        json = {
          "success" => true,
          "itemsCount" => @results.size,
          "totalResults" => @results.total_entries,
          "items" => @results.collect { |contribution| contribution.edm.as_result },
          "facets" => @facets,
          "params" => {
            "start" => @results.offset + 1,
            "query" => @query,
            "rows"  => @results.per_page
          }
        }.to_json

        json = "#{params[:callback]}(#{json});" unless params[:callback].blank?
        render :json => json
      end
    end
  end

  # GET /explore/:field_name/:term
  def explore
    search
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
    if @contribution.change_status_to(:withdrawn, current_user.id)
      flash[:notice] = t('flash.contributions.withdraw.notice')
      redirect_to contributor_dashboard_url
    else
      flash.now[:alert] = t('flash.contributions.withdraw.alert')
      render :action => 'withdraw'
    end
  end

  def cached(contribution, format)
    cache_key = "contributions/#{format.to_s}/#{contribution.id}.#{format.to_s}"

    if fragment_exist?(cache_key)
      data = YAML::load(read_fragment(cache_key))
    else
      data = case format
        when :json
          { :result => 'success', :object => contribution.edm.as_record }
        when :nt
          contribution.edm.to_ntriples
        when :xml
          contribution.edm.to_rdfxml
      end
      write_fragment(cache_key, data.to_yaml)
    end

    data
  end

protected

  def find_contribution
    @contribution = Contribution.find(params[:id], :include => [ :contributor, :attachments, :metadata, :tags ])
  end

  def redirect_to_search
    return if performed?

    # @todo Refine search results with an additional keyword, and replicate
    #   across all providers
#    unless params[:qf].blank?
#      params.merge!(:q => params[:q] + " " + params[:qf])
#      params.delete(:qf)
#      redirect_required = true
#    end

    if params[:provider] && params[:provider] != self.controller_name
      params.delete(:qf)
      params.delete(:field)
      params[:controller] = params[:provider]
      redirect_required = true
    end

    params.delete(:provider)

    redirect_to params if redirect_required
  end

  def facet_label(facet_name)
    if taxonomy_field_facet = facet_name.to_s.match(/^metadata_(.+)_ids$/)
      field_name = taxonomy_field_facet[1]
    else
      field_name = facet_name
    end

    t("views.search.facets.contributions.#{field_name}", :default => facet_name)
  end

  def facet_row_label(facet_name, row_value)
    @@metadata_fields ||= {}

    if row_value.is_a?(Integer)
      if taxonomy_field_facet = facet_name.to_s.match(/^metadata_(.+)_ids$/)
        field_name = taxonomy_field_facet[1]
        unless @@metadata_fields[field_name]
          @@metadata_fields[field_name] = MetadataField.includes(:taxonomy_terms).find_by_name(field_name)
        end
        if row_term = @@metadata_fields[field_name].taxonomy_terms.select { |term| term.id == row_value }.first
          row_label = row_term.term
        end
      end
    end

    row_label || row_value.to_s
  end

  def attachments_with_books
    attachments_with_books = @contribution.attachments.with_books
    WillPaginate::Collection.create(params[:page] || 1, params[:count] || 3, attachments_with_books.size) do |pager|
      pager.replace(attachments_with_books)
    end
  end
end
