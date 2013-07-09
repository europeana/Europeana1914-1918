class FixCollectionDayFieldInconsistencies < ActiveRecord::Migration
  class MetadataRecord < ActiveRecord::Base; end
  
  def self.up
    say_with_time "Fixing inconsistent collection day metadata" do
      {
        "BE08" => "BE08 ",
        "FR07" => [ "FR07 (?)", " FR07" ],
        "KI13" => "KI 13",
        "AM15" => [ "AM!5", "Am15", "AM;15", "AM" ],
        "LU16" => "6.03.2012 Luxembourg",
        "PR17" => [ "PR17 ", "10/03/2012 Preston", "10/03/2012, Preston",
                    "12/03/2012, Preston", "M Shaw", "PR17?" ],
        "DU18" => [ "Dublin ", "21 March 2012", "Dublin 21/03/2012", 
                    "Dublin, National Library of Ireland", 
                    "Dublin, National Library of Ireland, 21 March 2012", 
                    "Dublin, National Library of Ireland, 21/03/2012",
                    "Dubin, National Library of Ireland, 21/03/2012", "Du18",
                    "Dublin, National Library of Ireland, 21 March 2012. ",
                    "21 March 2012, National Library of Ireland" ],
        "NG19" => [ "28.03.2012", "Ng19" ]
      }.each_pair do |to, froms|
        [ froms ].flatten.each do |from|
          say "Changing \"#{from}\" to \"#{to}\"", true
          MetadataRecord.update_all [ 'field_collection_day = ?', to ], [ 'field_collection_day = ?', from ]
        end
      end
    end
  end

  def self.down
  end
end
