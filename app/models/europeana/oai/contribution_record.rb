module Europeana
  module OAI
    class ContributionRecord < Contribution
      include ContributionsHelper
      include Rails.application.routes.url_helpers
      
      has_edm_mapping Europeana::EDM::Mapping::Story

      default_scope published
      
      ##
      # Returns the OAI sets supported
      #
      def self.sets
        unless @sets.present?
          @sets = [ 
            OAI::Set.new(:spec => 'story', :name => 'Stories'),
            OAI::Set.new(:spec => 'story:institution', :name => 'Institutional providers'),
            OAI::Set.new(:spec => 'story:ugc', :name => 'UGC')
          ]
          Institution.all.each do |institution|
            @sets << institution.oai_set('story:institution:')
          end
        end
        @sets
      end
      
      ##
      # Returns the OAI sets this contribution belongs to
      #
      def sets
        unless @sets.present?
          @sets = [ OAI::Set.new(:spec => 'story', :name => 'Stories') ]
          if contributor.institution.present?
            @sets << OAI::Set.new(:spec => 'story:institution', :name => 'Institutional providers')
            @sets << contributor.institution.oai_set('story:institution:')
          else
            @sets << OAI::Set.new(:spec => 'story:ugc', :name => 'UGC')
          end
        end
        @sets
      end
      
      ##
      # Outputs metadata record for OAI Dublin Core
      #
      # @see OaiProvider
      #
      def to_oai_dc
        xml = ::Builder::XmlMarkup.new
        xml.tag!('oai_dc:dc', 
         OAI::Provider::Metadata::DublinCore.instance.header_specification.merge(
          { 'xmlns:dcterms' => "http://purl.org/dc/terms/" }
         )
        ) do
          xml.tag!('dc:title', title)
          unless metadata.fields['description'].blank?
            xml.tag!('dc:description', metadata.fields['description'])
          end
          if metadata.fields['contributor_behalf'].present?
            xml.tag!('dc:contributor', metadata.fields['contributor_behalf'])
          else
            xml.tag!('dc:contributor', contributor.contact.full_name)
          end
          unless metadata.fields['lang'].blank?
            metadata.fields['lang'].each do |lang|
              xml.tag!('dc:language', lang)
            end
          end
          unless metadata.fields['lang_other'].blank?
            xml.tag!('dc:language', metadata.fields['lang_other'])
          end
          unless metadata.fields['keywords'].blank?
            metadata.fields['keywords'].each do |keyword|
              xml.tag!('dc:subject', keyword)
            end
          end
          unless metadata.fields['theatres'].blank?
            metadata.fields['theatres'].each do |theatre|
              xml.tag!('dc:subject', theatre)
            end
          end
          unless metadata.fields['date_from'].blank? && metadata.fields['date_to'].blank?
            period = 'scheme=W3C-DTF;'
            period << (' start=' + metadata.fields['date_from'] + ';') unless metadata.fields['date_from'].blank?
            period << (' end=' + metadata.fields['date_to'] + ';') unless metadata.fields['date_to'].blank?
            xml.tag!('dc:date', period, :'xsi:type' => "dcterms:Period")
          end
          unless (host = Rails.application.config.action_mailer.default_url_options[:host]).blank?
            port = Rails.application.config.action_mailer.default_url_options[:port]
            Rails.application.routes.default_url_options[:locale] ||= Rails.configuration.i18n.default_locale
            identifier = localeless_contribution_url(:host => host, :port => port, :id => self.id)
            xml.tag!('dc:identifier', identifier, :'xsi:type' => "dcterms:URI")
          end
          xml.tag!('dc:type', 'Text', :'xsi:type' => "dcterms:DCMIType")
          [ 'location_placename', 'location_map' ].each do |coverage|
            unless metadata.fields[coverage].blank?
              xml.tag!('dc:coverage', metadata.fields[coverage])
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
        xml = ::Builder::XmlMarkup.new
        xml.tag!("oai_europeana19141918:europeana19141918",
          Europeana::OAI::MetadataFormat::Europeana19141918.instance.header_specification
        ) do
          c = self
          @metadata_fields = MetadataField.all.collect { |mf| mf.name }
          builder_file = File.read(File.join(::Rails.root.to_s, 'app', 'views', 'common', 'contributions', '_contribution.xml.builder'))
          instance_eval builder_file
        end
        xml.target!
      end
      
      def to_oai_edm
        edm.to_rdfxml.sub(/<\?xml .*? ?>/, "")
      end
    end
  end
end
