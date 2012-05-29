namespace :attachments do
  desc "Identify missing attachment files."
  task :missing => :environment do
    puts "Identifying missing attachment files..."
    Attachment.find_each do |attachment|
      if attachment.file.present? && !File.exists?(attachment.file.path)
        puts "  " + attachment.file.path
      end
    end
  end
  
  desc "Identify incorrectly sized attachment files."
  task :wrong_size => :environment do
    puts "Identifying incorrectly sized attachment files..."
    Attachment.find_each do |attachment|
      if attachment.file.present? && File.exists?(attachment.file.path) && (File.size(attachment.file.path) != attachment.file.size)
        puts "  " + attachment.file.path
      end
    end
  end
end
