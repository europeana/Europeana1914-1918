module ContributionsHelper
  def contribution_title(contribution)
    contribution.title.present? ? contribution.title : raw('<em>' + I18n.t('views.contributions.no_title') + '</em>')
  end
  
  def link_to_contribution(contribution)
    link_to contribution_title(contribution), contribution
  end

  # Returns a description of a contribution's submission/approval status
  def contribution_status(contribution)
    if contribution.approved?
      if contribution.approver.present? && current_user.may_approve_contributions?
        if current_user.may_administer_user?
          link = link_to(contribution.approver.contact.full_name, admin_user_path(contribution.approver))
          raw(I18n.t('views.contributions.status.approved_by', :name => link))
        else
          raw(I18n.t('views.contributions.status.approved_by', :name => contribution.approver.contact.full_name))
        end      
      else
        raw(I18n.t('views.contributions.status.approved'))
      end
    elsif contribution.submitted?
      raw(I18n.t('views.contributions.status.submitted'))
    elsif contribution.draft?
      raw(I18n.t('views.contributions.status.draft'))
    else
      raw(I18n.t('views.contributions.status.unknown'))
    end
  end
  
  # Gets a collection of taxonomy terms for the given metadata field
  #
  # Suitable for use with Formtastic select fields.
  def metadata_field_taxonomy_terms(metadata_field)
    case metadata_field.field_type
    when 'taxonomy'
      metadata_field.taxonomy_terms.collect { |term| [ term.term, term.id ] }
    else
      nil
    end
  end
  
  def uploadify_file_extensions
    if RunCoCo.configuration.allowed_upload_extensions.blank?
      ''
    else
      RunCoCo.configuration.allowed_upload_extensions.split(',').map { |ext| "*.#{ext}" }.join(';')
    end
  end
  
  def uploadify_file_desc
    if RunCoCo.configuration.allowed_upload_extensions.blank?
      ''
    else
      RunCoCo.configuration.allowed_upload_extensions.split(',').to_sentence
    end
  end
  
  def listing_fields
    @listing_fields ||= MetadataField.where(:show_in_listing => true)
  end
  
  def contribution_field_title(field_name)
    contribution_fields.select { |f| f.last == field_name }.flatten.first
  end
  
  def contribution_field_value(contribution, field_name)
    if field_name == 'attachments'
      contribution.attachments.size
    elsif field_name == 'contributor'
      contribution.contact.full_name
    elsif field_name == 'approver'
      contribution.approver ? contribution.approver.contact.full_name : ''
    elsif field_name == 'title'
      title_text = (contribution.title.present? ? truncate(contribution.title, :length => 50) : raw('<em>' + t('views.contributions.no_title') + '</em>'))
      contribution.draft? ? title_text : link_to(title_text, contribution)
    elsif field_name == 'created_at'
      l contribution.created_at, :format => :short
    elsif contribution.respond_to? field_name
      contribution.send(field_name)
    elsif contribution.metadata.respond_to? field_name
      value = contribution.metadata.send(field_name)
      if value.is_a?(Array) && value.first.is_a?(TaxonomyTerm)
        value.collect { |tt| tt.term }.to_sentence
      else
        value
      end
    else
      ''
    end
  end
end
