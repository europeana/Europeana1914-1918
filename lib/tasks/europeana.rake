namespace :europeana do
  desc "Purge any previously harvested Europeana records no longer in the portal, via DJ."
  task :purge => :environment do
    print "Creating a DelayedJob to purge deleted Europeana records... "
    Delayed::Job.enqueue EuropeanaPurgeJob.new, :queue => 'europeana_purge'
    puts "done."
  end
end
