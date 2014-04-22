namespace :europeana do
  desc "Purge any previously harvested Europeana records no longer in the portal, via DJ."
  task :purge => :environment do
    if Delayed::Job.where("handler LIKE '%Europeana::PurgeJob%'").count > 0
      puts "A DelayedJob to purge deleted Europeana records already exists."
    else
      print "Creating a DelayedJob to purge deleted Europeana records... "
      Delayed::Job.enqueue Europeana::PurgeJob.new, :queue => 'europeana'
      puts "done."
    end
  end
  
  desc "Update any previously harvested Europeana records since updated in the portal, via DJ."
  task :update => :environment do
    if Delayed::Job.where("handler LIKE '%Europeana::UpdateJob%'").count > 0
      puts "A DelayedJob to update Europeana records already exists."
    else
      print "Creating a DelayedJob to update Europeana records... "
      Delayed::Job.enqueue Europeana::UpdateJob.new, :queue => 'europeana'
      puts "done."
    end
  end
end
