module FeedHelper
  def feed_entry_summary(item)
    case item
    when Annotation
      feed_entry_summary(item.annotatable)
    when ActsAsTaggableOn::Tagging
      feed_entry_summary(item.taggable)
    when Contribution
      item.metadata.fields['description']
    when Attachment
      feed_entry_summary(item.contribution)
    when EuropeanaRecord
      edm_proxy_field(item.object['proxies'].first, 'dcDescription')
    end
  end
  
  def feed_entry_title(item)
    case item
    when Annotation
      user = item.user.contact.full_name
      user = (t('activerecord.models.user') + ' ' + item.user.id.to_s) unless user.present?
      key = item.annotatable.is_a?(Contribution) ? 'story' : 'item'
      I18n.t("views.contributions.feed.entries.annotation.#{key}", :user => user, :title => annotatable_title(item.annotatable))
    when ActsAsTaggableOn::Tagging
      user = item.tagger.contact.full_name
      user = (t('activerecord.models.user') + ' ' + item.tagger.id.to_s) unless user.present?
      key = item.taggable.is_a?(Contribution) ? 'story' : 'item'
      I18n.t("views.contributions.feed.entries.tagging.#{key}", :user => user, :title => item.taggable.title)
    when Contribution
      user = if item.metadata.fields['contributor_behalf'].present?
        item.metadata.fields['contributor_behalf']
      elsif item.contributor.contact.full_name.present?
        item.contributor.contact.full_name
      else
        (t('activerecord.models.user') + ' ' + item.contributor.id.to_s)
      end
      I18n.t('views.contributions.feed.entries.contribution', :user => user, :title => item.title)
    end
  end
  
  def feed_entry_img(item)
    case item
    when Annotation
      item.annotatable.is_a?(Contribution) ? feed_entry_img(item.annotatable) : item.src
    when ActsAsTaggableOn::Tagging
      feed_entry_img(item.taggable)
    when Contribution
      feed_entry_img(item.attachments.cover_image)
    when EuropeanaRecord
      edm_proxy_field(item.object['aggregations'].first, 'edmIsShownAt', :link => false)
    when Attachment
      item.thumbnail_url(:thumb)
    end
  end
end
