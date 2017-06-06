##
# Observer to (re)generate EDM mapping for contributions when they, or their
# attachments or contributor are updated.
class MetadataMappingObserver < ActiveRecord::Observer
  observe :contribution, :attachment, :user

  def after_save(model)
    case model
    when Contribution
      queue_job_for_contribution(model)
    when Attachment
      queue_job_for_contribution(model.contribution)
    when User
      model.contributions.find_each do |contribution|
        queue_job_for_contribution(contribution)
      end
    end
  end

protected

  def queue_job_for_contribution(contribution)
    return unless contribution.published?
    Delayed::Job.enqueue EDMMetadataMappingJob.new(contribution), :queue => 'mapping'
  end
end
