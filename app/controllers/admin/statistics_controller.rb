class Admin::StatisticsController < ApplicationController
  helper_method :collection_years
  
  # GET /admin/statistics
  def index
    @year = params[:year] || collection_years.last
    @collection_day = params[:collection_day]
    
    @statistics = 1.upto(12).collect do |month|
      monthly_statistics(@year, month, @collection_day)
    end
    
    @totals = Hash.new do |hash, key|
      hash[key] = @statistics.inject(0) { |sum, month_stats| sum = sum + month_stats[key] }
    end
  end
  
  def collection_years
    Contribution.published.select('YEAR(created_at) creation_year').order('creation_year').group('YEAR(created_at)').collect { |c| c.creation_year }
  end
  
  protected
  ##
  # Returns a hash of statistics for a given month
  def monthly_statistics(year, month, collection_day)
    cquery = Contribution.published.where('YEAR(contributions.created_at) = ? AND MONTH(contributions.created_at) = ?', year, month)
    aquery = Attachment.published.includes(:contribution).where('YEAR(contributions.created_at) = ? AND MONTH(contributions.created_at) = ?', year, month)
    
    if collection_day.present?
      cquery = cquery.includes(:metadata => { :taxonomy_terms => :metadata_field })
      cquery = cquery.where('metadata_fields.name = ? AND taxonomy_terms.id = ?', 'collection_day', collection_day)
      
      aquery = aquery.includes(:contribution => { :metadata => { :taxonomy_terms => :metadata_field } })
      aquery = aquery.where('metadata_fields.name = ? AND taxonomy_terms.id = ?', 'collection_day', collection_day)
    end
  
    {
      :month => t('date.month_names')[month],
      :contributions => cquery.count,
      :attachments => aquery.count
    }
  end
end
