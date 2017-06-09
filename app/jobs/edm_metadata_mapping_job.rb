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
  end

  def contribution
    @contribution ||= Contribution.find(@contribution_id)
  end
end
