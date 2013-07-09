class Admin::TaxonomyTermsController < AdminController
  before_filter :find_metadata_field
  before_filter :find_taxonomy_term, :except => [ :index, :new, :create, :import ]
  
  # GET /admin/fields/:metadata_field_id/terms
  def index
    @terms = @field.taxonomy_terms.paginate(:page => params[:page])
  end
  
  # GET /admin/fields/:metadata_field_id/terms/new
  def new
    @term = @field.taxonomy_terms.build
  end
  
  # POST /admin/fields/:metadata_field_id/terms
  def create
    @term = @field.taxonomy_terms.build(params[:taxonomy_term])
    if @term.save
      flash[:notice] = t('flash.actions.create.notice', :resource_name => TaxonomyTerm.human_name)
      redirect_to admin_metadata_field_taxonomy_terms_path(@field)
    else
      flash.now[:alert] = t('flash.actions.create.alert', :resource_name => TaxonomyTerm.human_name)
      render :action => 'new'
    end
  end
  
  # GET /admin/fields/:metadata_field_id/terms/import
  def import
    if request.post? && (taxonomy_terms = params[:taxonomy_terms])
      @field.taxonomy_terms.create_from_list(taxonomy_terms)
      flash[:notice] = t('flash.taxonomy.imported')
      redirect_to :action => :index
    end
  end
  
  # GET /admin/fields/:metadata_field_id/terms/:id/edit
  def edit
  end

  # PUT /admin/fields/:metadata_field_id/terms/:id
  def update
    if @term.update_attributes(params[:taxonomy_term])
      flash[:notice] = t('flash.actions.update.notice', :resource_name => TaxonomyTerm.human_name)
      redirect_to admin_metadata_field_taxonomy_terms_path(@field)
    else
      flash.now[:alert] = t('flash.actions.update.alert', :resource_name => TaxonomyTerm.human_name)
      render :action => 'edit'
    end
  end
  
  # GET /admin/fields/:metadata_field_id/terms/:id/delete
  def delete
  end
  
  # DELETE /admin/fields/:metadata_field_id/terms/:id
  def destroy
    if @term.destroy
      flash[:notice] = t('flash.actions.destroy.notice', :resource_name => TaxonomyTerm.human_name)
      redirect_to admin_metadata_field_taxonomy_terms_path(@field)
    else
      flash.now[:alert] = t('flash.actions.destroy.alert', :resource_name => TaxonomyTerm.human_name)
      render :action => 'delete'
    end
  end
  
  protected
  def find_metadata_field
    @field = MetadataField.find(params[:metadata_field_id], :include => :taxonomy_terms)
    raise ActiveRecord::RecordNotFound unless @field.field_type == 'taxonomy'
  end
  
  def find_taxonomy_term
    @term = @field.taxonomy_terms.find(params[:id])
  end
  
  def authorize!
    current_user.may_administer_metadata_fields!
  end
end
