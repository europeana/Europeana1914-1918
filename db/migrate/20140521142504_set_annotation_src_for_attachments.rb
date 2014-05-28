class Annotation < ActiveRecord::Base
  belongs_to :user
  belongs_to :annotatable, :polymorphic => true
end

class Contribution < ActiveRecord::Base
  def published?
    self.class.published_status.include?(current_status.to_sym)
  end
  has_record_statuses :draft, :submitted, :approved, :rejected, :revised, :withdrawn
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
