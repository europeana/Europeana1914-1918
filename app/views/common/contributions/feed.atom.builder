xml.instruct!
xml.feed :xmlns => "http://www.w3.org/2005/Atom", "xml:base" => configuration(:site_url) do |feed|
  feed.title t('views.contributions.feed.title'), :type => 'text'
  feed.link :href => feed_contributions_url(:format => 'atom'), :rel => 'self', :type => "application/atom+xml"
  feed.author do |author|
    author.name RunCoCo.configuration.site_name
  end
  feed.updated @activities.first[:updated].w3cdtf
  feed.id feed_contributions_url(:format => 'atom')

  @activities.each do |a|
    feed.entry do |entry|
      entry.title a[:title], :type => 'html'
      entry.updated a[:updated].w3cdtf
      entry.id a[:id]
      unless a[:link].blank?
        entry.link :href => a[:link], :rel => "alternate", :type => "text/html"
      end
      unless a[:summary].blank?
        entry.summary truncate(strip_tags(a[:summary]), :length => 140, :separator => ' '), :type => "text"
      end
      unless a[:thumb].blank?
        entry.content :type => "html" do |content|
          content.img :src => a[:thumb], :alt => ''
        end
      end
    end
  end
end
