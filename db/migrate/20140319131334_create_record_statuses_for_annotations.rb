class Annotation < ActiveRecord::Base
  has_record_statuses :published, :flagged, :unpublished, :revised
end

class CreateRecordStatusesForAnnotations < ActiveRecord::Migration
  def up
    print "Creating RecordStatus records for Annotation records... "
    Annotation.find_each do |annotation|
      RecordStatus.create!(
        :record => annotation, :status => 'published',
        :user_id => annotation.user_id.present? ? annotation.user_id : nil,
        :created_at => annotation.created_at
      )
    end
    puts "done."
  end

  def down
    print "Destroying RecordStatus records with record_type='Annotation'... "
    RecordStatus.destroy_all("record_type = 'Annotation'")
    puts "done."
  end
end
