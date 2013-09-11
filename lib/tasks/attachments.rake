namespace :attachments do
  desc "Identify missing attachment files."
  task :missing => :environment do
    puts "Identifying missing attachment files..."
    check_paperclip_storage!
    Attachment.find_each do |attachment|
      if attachment.file.present? && !File.exists?(attachment.file.path)
        puts "  " + attachment.file.path
      end
    end
  end
  
  desc "Identify incorrectly sized attachment files."
  task :wrong_size => :environment do
    puts "Identifying incorrectly sized attachment files..."
    check_paperclip_storage!
    Attachment.find_each do |attachment|
      if attachment.file.present? && File.exists?(attachment.file.path) && (File.size(attachment.file.path) != attachment.file.size)
        puts "  " + attachment.file.path
      end
    end
  end
  
  desc "Generate missing thumbnails."
  task :thumbnails => :environment do
    puts "Generating missing thumbnails..."
    check_paperclip_storage!
    styles = (ENV['STYLES'] || ENV['styles'] || '').split(',').map(&:to_sym)
    Attachment.find_each do |attachment|
      if attachment.file.present? && File.exists?(attachment.file.path)
        styles.each do |style|
          unless File.exists?(attachment.file.path(style))
            puts "- ID #{attachment.id.to_s} / style #{style.to_s}"
            attachment.file.reprocess!(style)
          end
        end
      end
    end
    puts "... done."
  end
  
  def check_paperclip_storage!
    unless Paperclip::Attachment.default_options[:storage] == :filesystem
      puts "  attachments are not stored on filesystem; aborting."
      exit
    end
  end
end
