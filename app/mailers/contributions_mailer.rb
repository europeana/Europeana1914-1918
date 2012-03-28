class ContributionsMailer < ActionMailer::Base
  default :from => Devise.mailer_sender

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.contributions_mailer.published.subject
  #
  def published(contribution)
    if contribution.by_guest?
      email = contribution.contact.email
    else
      email = contribution.contributor.email
    end
    return unless email.present?
    
    @contribution = contribution

    mail :to => email, :subject => "Your Europeana 1914-1918 contribution has been published"
  end
end
