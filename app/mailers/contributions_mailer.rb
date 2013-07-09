class ContributionsMailer < ActionMailer::Base
  default :from => Devise.mailer_sender

  def published(recipient, contribution)
    @contribution = contribution
    mail :to => recipient, :subject => t('mail.contributions.published.subject')
  end
end
