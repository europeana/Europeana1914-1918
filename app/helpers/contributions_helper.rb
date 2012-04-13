module ContributionsHelper
  def contribution_title(contribution)
    contribution.title.present? ? contribution.title : raw('<em>' + I18n.t('views.contributions.no_title') + '</em>')
  end
  
  def link_to_contribution(contribution)
    link_to contribution_title(contribution), contribution
  end

  # Returns a description of a contribution's submission/approval status
  def contribution_status(contribution)
    case contribution.status
    when :draft
      raw(I18n.t('views.contributions.status.draft'))
    when :submitted
      raw(I18n.t('views.contributions.status.submitted'))
    when :approved
      if contribution.current_status.user.present? && current_user.may_approve_contributions?
        if current_user.may_administer_users?
          link = link_to(contribution.current_status.user.contact.full_name, admin_user_path(contribution.current_status.user))
          raw(I18n.t('views.contributions.status.approved_by', :name => link))
        else
          raw(I18n.t('views.contributions.status.approved_by', :name => contribution.current_status.user.contact.full_name))
        end      
      else
        raw(I18n.t('views.contributions.status.approved'))
      end
    when :rejected
      if contribution.current_status.user.present? && current_user.may_reject_contributions?
        if current_user.may_administer_users?
          link = link_to(contribution.current_status.user.contact.full_name, admin_user_path(contribution.current_status.user))
          raw(I18n.t('views.contributions.status.rejected_by', :name => link))
        else
          raw(I18n.t('views.contributions.status.rejected_by', :name => contribution.current_status.user.contact.full_name))
        end      
      else
        raw(I18n.t('views.contributions.status.rejected'))
      end
    else
      raw(I18n.t('views.contributions.status.unknown'))
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
    if current_user.may_catalogue_contribution?
      @listing_fields ||= MetadataField.where(:show_in_listing => true)
    else
      @public_listing_fields ||= MetadataField.where(:show_in_listing => true, :cataloguing => false)
    end
  end
  
  def contribution_field_title(field_name)
    contribution_fields.select { |f| f.last == field_name }.flatten.first
  end
  
  def contribution_field_value(contribution, field_name, options = {})
    options.assert_valid_keys(:limit)
    
    if field_name == 'attachments'
      contribution.attachments.size
    elsif field_name == 'contributor'
      contribution.contact.full_name
    elsif field_name == 'cataloguer'
      contribution.cataloguer ? contribution.cataloguer.contact.full_name : ''
    elsif field_name == 'title'
      title_text = (contribution.title.present? ? truncate(contribution.title, :length => 50) : raw('<em>' + t('views.contributions.no_title') + '</em>'))
      link_to(title_text, contribution)
    elsif field_name == 'created_at'
      l contribution.created_at, :format => :timestamp
    elsif contribution.respond_to? field_name
      contribution.send(field_name)
    elsif contribution.metadata.respond_to? field_name
      value = contribution.metadata.send(field_name)
      if value.is_a?(Array) && value.first.is_a?(TaxonomyTerm)
        value.collect { |tt| tt.term }.to_sentence
      else
        if options[:limit] && value.respond_to?(:truncate)
          truncate(value, :length => options[:limit])
        else
          value
        end
      end
    else
      ''
    end
  end
  
  ##
  # Gets the URL path for a contribution without the :locale prefix.
  #
  # @example
  #   localeless_contribution_path(:id => 1234) #=> "/contributions/1234"
  #
  # @param [Hash] options URL generation options passed to #url_for
  # @return [String] the URL path
  def localeless_contribution_path(options)
    contribution_path(options).sub(/^\/\w+/, '')
  end
  
  ##
  # Gets the URL for a contribution without the :locale prefix.
  #
  # @example
  #   localeless_contribution_url(:id => 1234)
  #     #=> "http://www.example.org/contributions/1234"
  #
  # @param [Hash] options URL generation options passed to #url_for
  # @return [String] the URL
  def localeless_contribution_url(options)
    contribution_url(options).match(/(^\w+:\/\/[^\/]+)\/\w+(.*)$/)[1..2].join
  end
end
