class Admin::AnnotationsController < AdminController
  # GET /admin/annotations
  def index
    count = [ (params[:count] || 20).to_i, 100 ].min # Default 20, max 100
    page = params[:page] || 1
    
    items = ActsAsTaggableOn::Tagging.order('created_at DESC').limit(count) +
      Annotation.order('created_at DESC').limit(count)
      
    @annotations = items.collect do |item|
      case item
      when ActsAsTaggableOn::Tagging
        { 
          :contribution => item.taggable,
          :user => item.tagger,
          :text => item.tag.name,
          :created_at => item.created_at,
          :id => item.id,
          :type => 'tagging'
        }
      when Annotation
        { 
          :contribution => item.attachment.contribution,
          :user => item.user,
          :text => item.text,
          :created_at => item.created_at,
          :id => item.id,
          :type => 'annotation'
        }
      end
    end
    
    @annotations.sort_by! { |a| a[:created_at] }
    @annotations = @annotations.reverse[0..(count - 1)]
    
    @annotations.each do |a|
      a[:user_name] = a[:user].contact.full_name
      a[:user_name] = (t('activerecord.models.user') + ' ' + a[:user].id.to_s) unless a[:user_name].present?
    end
  end
end
