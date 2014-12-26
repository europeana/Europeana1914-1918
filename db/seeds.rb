# Encoding: utf-8

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Major.create(:name => 'Daley', :city => cities.first)

puts 'Creating an admin user'
admin = User.new(:username => 'admin', :email => 'adminm@example.com', :password => 'secret', :password_confirmation => 'secret', :contact_attributes => { :full_name => 'Admin' })
admin.role_name = 'administrator'
admin.save
puts "  Username: #{admin.username}"

puts

puts 'Initialising settings:'
{
  :allowed_upload_extensions => 'doc,docx,pdf,txt,jpg,jpeg,jp2,jpx,gif,png,tiff,mp3,ogg,ogv,webm,mp4,avi,mpg,zip,mp3',
  :banner_active => false,
  :banner_text => '',
  :bing_client_id => '',
  :bing_client_secret => '',
  :bing_translate_key => '',
  :contribution_approval_required => true,
  :gmap_api_email => '',
  :gmap_api_key => '',
  :google_analytics_key => '',
  :max_upload_size => 80214400,
  :publish_contributions => true,
  :registration_required => true,
  :search_engine => :solr,
  :sharethis_id => 'abcdefgh-abcd-abcd-abcd-abcdefghijkl',
  :site_name => 'Europeana 1914-1918',
  :site_url => 'http://localhost:3000',
  :ui_locales => [ 'en', 'da', 'de', 'el', 'fr', 'it', 'nl', 'sl' ],
  :uploadify => true
}.each_pair do |setting, value|
  puts "  #{setting.to_s} => #{value.to_s}"
  RunCoCo.configuration.send("#{setting.to_s}=", value)
end
RunCoCo.configuration.save

puts

puts 'Initialisting taxonomy fields:'
taxonomy_fields = [{:show_in_listing=>false, :hint=>nil, :field_type=>"taxonomy", :attachment=>true, :cataloguing=>false, :required=>false, :contribution=>false, :position=>2, :multi=>true, :title=>"Cover image", :facet=>false, :name=>"cover_image", :searchable=>false}, {:show_in_listing=>false, :hint=>nil, :field_type=>"taxonomy", :attachment=>true, :cataloguing=>false, :required=>false, :contribution=>false, :position=>4, :multi=>false, :title=>"Side", :facet=>false, :name=>"object_side", :searchable=>false}, {:show_in_listing=>false, :hint=>"The language of the object, letter, postcard etc.", :field_type=>"taxonomy", :attachment=>true, :cataloguing=>false, :required=>false, :contribution=>true, :position=>10, :multi=>true, :title=>"Language", :facet=>false, :name=>"lang", :searchable=>false}, {:show_in_listing=>false, :hint=>"What the object is (for example poem, letter, photograph or piece of memorabilia).", :field_type=>"taxonomy", :attachment=>true, :cataloguing=>false, :required=>false, :contribution=>false, :position=>12, :multi=>false, :title=>"Content", :facet=>false, :name=>"content", :searchable=>true}, {:show_in_listing=>false, :hint=>"Only assign keywords which indicate or describe the main subject or broader concept which would help a user search for this content in the collection. If a relevant subject is not available please contact xxxx with details.", :field_type=>"taxonomy", :attachment=>true, :cataloguing=>false, :required=>false, :contribution=>true, :position=>33, :multi=>true, :title=>"Keywords", :facet=>false, :name=>"keywords", :searchable=>true}, {:show_in_listing=>false, :hint=>"", :field_type=>"taxonomy", :attachment=>true, :cataloguing=>false, :required=>false, :contribution=>true, :position=>34, :multi=>true, :title=>"Theatres of War", :facet=>false, :name=>"theatres", :searchable=>true}, {:show_in_listing=>false, :hint=>"", :field_type=>"taxonomy", :attachment=>true, :cataloguing=>false, :required=>false, :contribution=>true, :position=>35, :multi=>true, :title=>"Keywords: Forces", :facet=>false, :name=>"forces", :searchable=>true}, {:show_in_listing=>false, :hint=>"Select 'yes' if this contribution should be considered for the blog of stories to publicise the collection.", :field_type=>"taxonomy", :attachment=>false, :cataloguing=>true, :required=>false, :contribution=>true, :position=>36, :multi=>true, :title=>"Editor's pick", :facet=>false, :name=>"editor_pick", :searchable=>false}, {:show_in_listing=>false, :hint=>"Select your name from the list", :field_type=>"taxonomy", :attachment=>false, :cataloguing=>true, :required=>false, :contribution=>true, :position=>39, :multi=>false, :title=>"Cataloguer", :facet=>false, :name=>"cataloguer", :searchable=>false}, {:show_in_listing=>false, :hint=>"If item is from a submissions day, add code FR07 (for Frankfurt), BE08 (Berlin), MU09 (Munich), ST10 (Stuttgart), EF11 (Erfurt), DD12 (Dresden), KI13 (Kiel), RG14 (Regensburg), AM15 (Amberg).", :field_type=>"taxonomy", :attachment=>false, :cataloguing=>true, :required=>true, :contribution=>true, :position=>40, :multi=>nil, :title=>"Collection Day", :facet=>false, :name=>"collection_day", :searchable=>true}, {:show_in_listing=>false, :hint=>"The source that the item was digitised from (for example a leaf, a folio, a notebook, a reel of film).", :field_type=>"taxonomy", :attachment=>true, :cataloguing=>true, :required=>false, :contribution=>false, :position=>41, :multi=>false, :title=>"Source", :facet=>false, :name=>"source", :searchable=>false}, {:show_in_listing=>false, :hint=>"The material of the object that has been digitised (for example paper, card, tape).", :field_type=>"taxonomy", :attachment=>true, :cataloguing=>true, :required=>false, :contribution=>false, :position=>42, :multi=>false, :title=>"Medium", :facet=>false, :name=>"format", :searchable=>false}, {:show_in_listing=>false, :hint=>"The type of file the item is (Text, Image, Audio or Video). ", :field_type=>"taxonomy", :attachment=>true, :cataloguing=>true, :required=>true, :contribution=>false, :position=>45, :multi=>false, :title=>"File type", :facet=>false, :name=>"file_type", :searchable=>false}, {:show_in_listing=>false, :hint=>"", :field_type=>"taxonomy", :attachment=>true, :cataloguing=>true, :required=>false, :contribution=>false, :position=>46, :multi=>false, :title=>"License", :facet=>false, :name=>"license", :searchable=>false}]
taxonomy_fields.each do |settings|
  puts "  #{settings[:title]}"
  MetadataField.create(settings)
end

puts

puts "Initialising taxonomy terms:"
taxonomy_terms = {"cataloguer"=>["Alenka Ferlež", "Aljoša Križaj", "Alun Edwards", "Ana Trifunović Černe", "André Schoup", "Andreja Videc", "Anja Frković", "Annelies van Nispen", "Aoife O'Connell", "Aruzo", "Aubery Escande", "Benjamin Hirschfeld", "Blaž Torkar", "Breda Karun", "Breda Seljak", "Brid O'Sullivan", "Britta Woldering", "Carola Eugster", "Christine.Kremer", "Ciara Boylan", "Corinne Schroeder", "Daniel König", "Darragh Begley", "Dr. Maximilian Schreiber", "Everett Sharp", "Frank Drauschke", "Gabriel Hanganu", "Gerhard Hirschfeld", "Hans Bresgott", "Holger Fricke", "Imke W", "Imke Widmaier", "Irena Škvarč", "Irena Tul", "Janko Germadnik", "Joachim Buergschwentner", "Joanna Finegan", "Klementina Kolarek", "Ladislav Mesarič", "Laura Chersicola", "Liz Danskin", "Luana Malec", "Lucija Posinek Gorjanc", "Lynn Herr", "Mandy Stewart", "Marijan Pušavec", "Mateja Žvižej", "Matthias Egger", "Max Schreiber", "Mica Zorko", "Michael Kassube", "Michael Payne", "Mladen Horvat", "Other", "Polonca Kavčič", "Provinzialbibliothek Amberg", "Romain Schroeder", "Sara Smyth", "Sarah O'Connor", "Siglinde Kurz", "Silvester Vodopivec", "Simona Pors", "Srečko Maček", "Stéphanie Kovacs", "Stephen Bull", "Stuart Lee", "Vanja Šuligoj", "Ylva Berglund Prytz", "Zdenka Žigon"], "format"=>["Canvas", "Card", "Ceramic/China", "Digital", "Leather", "Metal", "Mixed", "Other", "Paper", "Photographic paper", "Tape", "Text: memoir", "Text: transcription", "Unknown", "Vinyl", "Wood"], "license"=>["http://creativecommons.org/licenses/by-sa/3.0/", "http://creativecommons.org/publicdomain/mark/1.0/"], "object_side"=>["Back", "Front"], "collection_day"=>["AA22", "AM15", "AN21", "BA23", "BE08", "CE22", "CY01", "DD12", "DU", "DU18", "EF11", "FR07", "HA21", "INTERNET", "KI13", "LE21", "LI05", "LJ23", "LOG25", "LU16", "MB007", "MB011", "MB20", "MU09", "NG19", "PR17", "RG14", "RM15", "SO14", "ST10", "TR16", "UNKNOWN", "VP18", "YP01"], "content"=>["Autograph", "Book", "Collection", "Diary", "Drawing", "Footage", "Interview", "Letter", "Map", "Medal", "Memoir", "Memorabilia", "Multiple", "Music", "Official document", "Other", "Painting", "Photograph", "Poem", "Postcard", "Publication", "Weapon"], "lang"=>["Dansk", "Deutsch", "English", "Français", "Gaeilge", "Italiano", "Nederlands", "Other", "Slovenščina", "Ελληνικά"], "forces"=>["Allied Forces", "Central Powers", "Imperial Forces"], "theatres"=>["Aerial Warfare", "African Wars", "Balkans", "Eastern Front", "Gallipoli Front", "Italian Front", "Middle East", "Naval Warfare", "Western Front"], "file_type"=>["3D", "IMAGE", "SOUND", "TEXT", "VIDEO"], "source"=>["Artifact", "Book", "Film", "Folio", "Journal", "Leaf", "Multiple", "Newspaper", "Notebook", "Other", "Photograph", "Postcard", "Tape", "Unknown", "Vinyl record"], "editor_pick"=>["yes"], "keywords"=>["Anti-War Movement", "Artillery", "Conscientious Objection", "Gas Warfare", "Home Front", "Manufacture", "Medical", "Military Punishment", "Prisoners of War", "Propaganda", "Recruitment and Conscription", "Remembrance", "Tanks and Armoured Fighting Vehicles", "Transport", "Trench Life", "Women"], "cover_image"=>["yes"]}
taxonomy_terms.each_pair do |field_name, terms|
  field = MetadataField.find_by_name(field_name)
  puts "  #{field.title}:"
  terms.each do |term|
    puts "    #{term}"
    tt = TaxonomyTerm.new(:term => term)
    tt.metadata_field = field
    tt.save
  end
end
