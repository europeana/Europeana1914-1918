class CollectionDaysController < ApplicationController
  def index
    @collection_days = CollectionDay.order('start_date DESC, end_date DESC').paginate(:page => params[:page] || 1)
  end
  
  def show
    @collection_day = CollectionDay.find_by_code(params[:id])
  end
end
