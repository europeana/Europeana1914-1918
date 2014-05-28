class Annotation < ActiveRecord::Base
  belongs_to :user
  belongs_to :annotatable, :polymorphic => true
end

class Contribution < ActiveRecord::Base
  has_record_statuses :draft, :submitted, :approved, :rejected, :revised, :withdrawn
  
  def published?
    self.class.published_status.include?(current_status.to_sym)
  end
  
  def self.published_status
    if !RunCoCo.configuration.publish_contributions
      [ nil ] # i.e. never
    elsif RunCoCo.configuration.contribution_approval_required
      [ :approved ]
    else
      [ :submitted, :approved ]
    end
  end
end

class RecordStatus < ActiveRecord::Base
  belongs_to :record, :polymorphic => true
  belongs_to :user
  
  validates_presence_of :name
  validates_inclusion_of :name, :in => lambda { |status| status.record.class.valid_record_statuses }
  
  def to_sym
    name.to_sym
  end
end

class SetAnnotationSrcForAttachments < ActiveRecord::Migration
  def up
    Annotation.where('annotatable_type IS NULL').update_all(:annotatable_type => 'Attachment')
    
    Annotation.where(:annotatable_type => 'Attachment').find_each do |annotation|
      attachment_url = annotation.annotatable.file.url(:large, :timestamp => false)
      if attachment_url.match(/\A\//)
        attachment_url = RunCoCo.configuration.site_url + attachment_url
      end
      annotation.src = attachment_url
      annotation.save!
    end
  end

  def down
  end
end
