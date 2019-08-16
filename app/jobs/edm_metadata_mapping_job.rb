##
# Job to generate and store EDM metadata mapping for a contribution
class EDMMetadataMappingJob
  def initialize(contribution_id)
    @contribution_id = contribution_id
  end

  def perform
    mapping = MetadataMapping.where(:mappable_type => 'Contribution', :mappable_id => contribution.id, :format => 'edm_rdfxml').first_or_initialize
    mapping.content = contribution.edm.to_rdfxml
    mapping.save

    if contribution.attachments_have_rich_metadata?
      contribution.attachments.includes(:metadata => :taxonomy_terms).find_each do |attachment|
        a_mapping = MetadataMapping.where(:mappable_type => 'Attachment', :mappable_id => attachment.id, :format => 'edm_rdfxml').first_or_initialize
        a_mapping.content = attachment.edm.to_rdfxml
        a_mapping.save
      end
    end
  end

  def contribution
    @contribution ||= Contribution.find(@contribution_id)
  end
end
