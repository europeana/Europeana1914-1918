xml.instruct!
xml.feed :xmlns => "http://www.w3.org/2005/Atom" do |feed|
  feed.title t('views.contributions.feed.title'), :type => 'html'
  feed.author RunCoCo.configuration.site_name
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
    end
  end
end
