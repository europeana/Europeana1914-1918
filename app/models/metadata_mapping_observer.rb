##
# Observer to (re)generate EDM mapping for contributions when they, or their
# attachments or contributor are updated.
class MetadataMappingObserver < ActiveRecord::Observer
  observe :contribution, :attachment, :metadata_record, :user

  def after_save(model)
    subject = contribution_from_observed_model(model)

    if subject.respond_to?(:find_each)
      subject.find_each do |contribution|
        queue_job_for_contribution(contribution)
      end
    else
      queue_job_for_contribution(subject)
    end
  end

protected

  def contribution_from_observed_model(model)
    case model
    when Contribution
      model
    when Attachment
      model.contribution
    when MetadataRecord
      model.contribution.present? ? model.contribution : model.attachment.contribution
    when User
      model.contributions
    end
  end

  def queue_job_for_contribution(contribution)
    return unless contribution.published?
    Delayed::Job.enqueue EDMMetadataMappingJob.new(contribution), :queue => 'mapping'
  end
end
