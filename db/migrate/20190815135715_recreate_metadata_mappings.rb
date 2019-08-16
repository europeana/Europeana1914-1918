class RecreateMetadataMappings < ActiveRecord::Migration
  def up
    MetadataMapping.where(:format => 'edm_rdfxml').destroy_all

    Contribution.published.find_each do |contribution|
      print '.'
      job = EDMMetadataMappingJob.new(contribution.id)
      job.perform
    end

    puts ' DONE.'
  end

  def down
    puts "No rollback for this migration."
  end
end
