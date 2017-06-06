namespace :mappings do
  desc "Generate EDM RDF/XML for all contributions, via DJ."
  task :edm_rdfxml => :environment do
    Contribution.pluck(:id).each do |contribution_id|
      Delayed::Job.enqueue EDMMetadataMappingJob.new(contribution_id), :queue => 'mapping'
    end
  end
end
