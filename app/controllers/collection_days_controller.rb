class CollectionDaysController < ApplicationController
  def index
    @collection_days = CollectionDay.includes(:taxonomy_term, :contact).all
    @collection_days.sort! { |a, b| 
      (I18n.t("countries.#{a.contact.country}") <=> I18n.t("countries.#{b.contact.country}")).nonzero? ||
      (a.name <=> b.name).nonzero? ||
      (b.start_date <=> a.start_date).nonzero? ||
      (b.end_date <=> a.end_date).nonzero? ||
      0
    }
  end
  
  def show
    @collection_day = CollectionDay.find_by_code(params[:id])
  end
end
