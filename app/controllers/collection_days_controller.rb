class CollectionDaysController < ApplicationController
  def index
    @collection_days = CollectionDay.includes(:taxonomy_term, :contact).all
    @collection_days.sort_by! { |cd| [ I18n.t("countries.#{cd.contact.country}"), cd.name ] }
  end
  
  def show
    @collection_day = CollectionDay.find_by_code(params[:id])
  end
end
