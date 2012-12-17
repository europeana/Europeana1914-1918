require 'oai'

class OaiProviderActiveRecordWrapper < OAI::Provider::ActiveRecordWrapper
  protected
  def find_scope(options)
    if (options[:set] == 'story') && (model == PublishedContribution)
      return model
    end
    
    super
  end
end
