class ExportsMailer < ActionMailer::Base
  default :from => Devise.mailer_sender

  def complete(recipient, path)
    @path = path
    mail :to => recipient, :subject => t('mail.exports.complete.subject')
  end
end
