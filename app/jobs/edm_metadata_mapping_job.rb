##
# Job to generate and store EDM metadata mapping for a contribution
class EDMMetadataMappingJob
  def initialize(resource_id, resource_class = 'Contribution')
    @resource_id = resource_id
    @resource_class = resource_class
  end

  def perform
    mapping = MetadataMapping.where(:mappable_type => @resource_class, :mappable_id => resource.id, :format => 'edm_rdfxml').first_or_initialize
    mapping.content = resource.edm.to_rdfxml
    mapping.save

    return unless @resource_class == 'Contribution'

    if resource.attachments_have_rich_metadata?
      resource.attachments.find_each do |attachment|
        Delayed::Job.enqueue(self.class.new(attachment.id, 'Attachment'), :queue => 'mapping')
      end
    end
  end

  def resource
    @resource ||= Object.const_get(@resource_class).find(@resource_id)
  end
end
