class ContributionsMailer < ActionMailer::Base
  default :from => Devise.mailer_sender

  def published(contribution)
    if contribution.by_guest?
      email = contribution.contact.email
    else
      email = contribution.contributor.email
    end
    return unless email.present?
    
    @contribution = contribution

    mail :to => email, :subject => t('mail.contributions.published.subject')
  end
end
