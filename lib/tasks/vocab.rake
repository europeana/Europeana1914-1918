namespace :vocab do
  desc "Output vocabularies as SKOSRDF/XML. Restrict with VOCABS=a,b,c"
  task :skos => :environment do
    fields = MetadataField.where(:field_type => "taxonomy")
    if ENV['VOCABS']
      fields = fields.where(:name => ENV['VOCABS'].split(','))
    end

    builder = Nokogiri::XML::Builder.new do |xml|
      xml['rdf'].RDF("xmlns:rdf" => "http://www.w3.org/1999/02/22-rdf-syntax-ns#", "xmlns:skos" => "http://www.w3.org/2004/02/skos/core#", "xmlns:dcterms" => "http://purl.org/dc/terms/") do
    
        fields.each do |field|
          scheme_uri = RunCoCo.configuration.site_url + "/vocabulary/#{field.name}"
          xml['rdf'].Description('rdf:about' => scheme_uri) do
            xml['rdf'].type('rdf:resource' => "http://www.w3.org/2004/02/skos/core#ConceptScheme")
            xml['dcterms'].title(RunCoCo.configuration.site_name + ": " + field.name, 'xml:lang' => :en)
            
            I18n.available_locales.each do |lang|
              begin
                translation = I18n.translate!(field.name, :scope => "formtastic.labels.contribution.metadata", :locale => lang)
              rescue I18n::MissingTranslationData
                # Ignore empty translations
                if lang == I18n.default_locale
                  translation = field.title
                end
              end
              unless translation.nil?
                xml['skos'].prefLabel(translation, 'xml:lang' => lang.to_s)
              end
            end
          end

          field.taxonomy_terms.each do |term|
            term_uri = RunCoCo.configuration.site_url + "/vocabulary/#{term.id}"
            xml['rdf'].Description('rdf:about' => term_uri) do
              xml['rdf'].type('rdf:resource' => "http://www.w3.org/2004/02/skos/core#Concept")
              xml['skos'].inScheme("rdf:resource" => scheme_uri)
              
              I18n.available_locales.each do |lang|
                begin
                  translation = I18n.translate!(term.term, :scope => "formtastic.labels.taxonomy_term.#{field.name}", :locale => lang)
                rescue I18n::MissingTranslationData
                  # Ignore empty translations
                  if lang == I18n.default_locale
                    translation = term.term
                  end
                end
                unless translation.nil?
                  xml['skos'].prefLabel(translation, 'xml:lang' => lang.to_s)
                  xml['dcterms'].title(translation, 'xml:lang' => lang.to_s)
                end
              end
            end
          end
        end
      end
      
    end
    
    puts builder.to_xml
  end
end
