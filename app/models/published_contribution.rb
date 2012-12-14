class PublishedContribution < Contribution
  include ContributionsHelper
  include Rails.application.routes.url_helpers

  default_scope where(:current_status => ContributionStatus.published)
  
  ##
  # Outputs metadata record for OAI Dublin Core
  #
  # @see OaiProvider
  #
  def to_oai_dc
    xml = Builder::XmlMarkup.new
    xml.tag!("oai_dc:dc",
     OAI::Provider::Metadata::DublinCore.instance.header_specification.merge(
      { 'xmlns:dcterms' => "http://purl.org/dc/terms/" }
     )
    ) do
      xml.tag!('oai_dc:title', title)
      unless metadata.fields['description'].blank?
        xml.tag!('oai_dc:description', metadata.fields['description'])
      end
      if metadata.fields['contributor_behalf'].present?
        xml.tag!('oai_dc:contributor', metadata.fields['contributor_behalf'])
      else
        xml.tag!('oai_dc:contributor', contributor.contact.full_name)
      end
      unless metadata.fields['lang'].blank?
        metadata.fields['lang'].each do |lang|
          xml.tag!('oai_dc:language', lang)
        end
      end
      unless metadata.fields['lang_other'].blank?
        xml.tag!('oai_dc:language', metadata.fields['lang_other'])
      end
      unless metadata.fields['keywords'].blank?
        metadata.fields['keywords'].each do |keyword|
          xml.tag!('oai_dc:subject', keyword)
        end
      end
      unless metadata.fields['theatres'].blank?
        metadata.fields['theatres'].each do |theatre|
          xml.tag!('oai_dc:subject', theatre)
        end
      end
      unless metadata.fields['date_from'].blank? && metadata.fields['date_to'].blank?
        period = 'scheme=W3C-DTF;'
        period << (' start=' + metadata.fields['date_from'] + ';') unless metadata.fields['date_from'].blank?
        period << (' end=' + metadata.fields['date_to'] + ';') unless metadata.fields['date_to'].blank?
        xml.tag!('oai_dc:date', period, :'xsi:type' => "dcterms:Period")
      end
      unless (host = Rails.application.config.action_mailer.default_url_options[:host]).blank?
        port = Rails.application.config.action_mailer.default_url_options[:port]
        Rails.application.routes.default_url_options[:locale] ||= Rails.configuration.i18n.default_locale
        identifier = localeless_contribution_url(:host => host, :port => port, :id => self.id)
        xml.tag!('oai_dc:identifier', identifier, :'xsi:type' => "dcterms:URI")
      end
      xml.tag!('oai_dc:type', 'Text', :'xsi:type' => "dcterms:DCMIType")
      [ 'location_placename', 'location_map' ].each do |coverage|
        unless metadata.fields[coverage].blank?
          xml.tag!('oai_dc:coverage', metadata.fields[coverage])
        end
      end
    end
    xml.target!
  end
  
  ##
  # Outputs metadata record for OAI in custom Europeana 1914-1918 XML format
  #
  # @see OaiProvider
  #
  def to_oai_europeana19141918
    Rails.application.routes.default_url_options[:locale] ||= Rails.configuration.i18n.default_locale
    xml = Builder::XmlMarkup.new
    xml.tag!("oai_europeana19141918:europeana19141918",
      OAI::Provider::Metadata::Europeana19141918.instance.header_specification
    ) do
      c = self
      @metadata_fields = MetadataField.all.collect { |mf| mf.name }
      builder_file = File.read(File.join(::Rails.root.to_s, 'app', 'views', 'contributions', '_contribution.xml.builder'))
      instance_eval builder_file
    end
    xml.target!
  end
end
