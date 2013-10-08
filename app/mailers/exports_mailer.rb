class ExportsMailer < ActionMailer::Base
  default :from => Devise.mailer_sender

  def complete(export)
    @export = export
    mail :to => export.user.email, :subject => t('mail.exports.complete.subject')
  end
end
