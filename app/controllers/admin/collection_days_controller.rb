# @todo Add a before filter requiring collection day metadata field to exist,
#   else displaying an error message
class Admin::CollectionDaysController < AdminController
  def index
    find_metadata_field
    
    @collection_days = []
    cd_terms = @metadata_field.taxonomy_terms.where('term NOT IN (?)', CollectionDay::INVALID_CODES).paginate(:page => params[:page] || 1)
    cd_terms.each do |cd_term|
      unless collection_day = CollectionDay.find_by_taxonomy_term_id(cd_term.id)
        collection_day = CollectionDay.new(:taxonomy_term_id => cd_term.id)
      end
      @collection_days << collection_day
    end
    
    @collection_days = WillPaginate::Collection.create(cd_terms.current_page, cd_terms.per_page, cd_terms.total_entries) do |pager|
      pager.replace(@collection_days)
    end
  end
  
  def edit
    prepare_new_collection_day unless find_collection_day
  end
  
  def update
    prepare_new_collection_day unless find_collection_day
    @collection_day.attributes = params[:collection_day]
    if @collection_day.save
      flash[:notice] = t('flash.actions.update.notice', :resource_name => t('activerecord.models.collection_day'))
      redirect_to admin_collection_days_path
    else
      flash.now[:alert] = t('flash.actions.update.alert', :resource_name => t('activerecord.models.collection_day'))
      render :action => :edit
    end
  end
  
  def delete
    find_collection_day
  end
  
  def destroy
    find_collection_day
    if @collection_day.destroy
      flash[:notice] = t('flash.actions.destroy.notice', :resource_name => t('activerecord.models.collection_day'))
      redirect_to admin_collection_days_path
    else
      flash.now[:alert] = t('flash.actions.destroy.alert', :resource_name => t('activerecord.models.collection_day'))
      render :action => :delete
    end
  end
  
protected

  def authorize!
    current_user.may_administer_metadata_fields!
  end
  
  def find_metadata_field
    @metadata_field = MetadataField.find_by_name('collection_day')
  end
  
  def find_collection_day
    @collection_day = CollectionDay.find_by_code(params[:id])
  end
  
  def prepare_new_collection_day
    find_metadata_field
    cd_term = @metadata_field.taxonomy_terms.find_by_term(params[:id])
    @collection_day = CollectionDay.new(:taxonomy_term_id => cd_term.id)
  end
end
