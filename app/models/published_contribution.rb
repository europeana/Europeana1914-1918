class PublishedContribution < Contribution
  default_scope where(:current_status => ContributionStatus.published)
end
