module ActsAsTaggableOn
  class Tagging < ActiveRecord::Base
    belongs_to :tagger,   :polymorphic => true
    has_record_statuses :published, :flagged, :unpublished, :revised
  end
end

class CreateRecordStatusesForTaggings < ActiveRecord::Migration
  def up
    print "Creating RecordStatus records for ActsAsTaggableOn::Tagging records... "
    ActsAsTaggableOn::Tagging.find_each do |tagging|
      RecordStatus.create!(
        :record => tagging, :status => 'published',
        :user_id => tagging.tagger_id.present? ? tagging.tagger_id : nil,
        :created_at => tagging.created_at
      )
    end
    puts "done."
  end

  def down
    print "Destroying RecordStatus records with record_type='ActsAsTaggableOn::Tagging'... "
    RecordStatus.destroy_all("record_type = 'ActsAsTaggableOn::Tagging'")
    puts "done."
  end
end
