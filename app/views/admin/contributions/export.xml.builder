xml.instruct!
xml.collection do
  @contributions.each do |c|
    if c.attachments.size > 0
      c.attachments.each do |a|
        xml << render(:partial => 'contribution', :locals => { :c => c, :a => a } )
      end
    else
       xml << render(:partial => 'contribution', :locals => { :c => c } )
    end
  end
end
