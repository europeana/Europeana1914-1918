class MakeAlternativeTitleFieldContributionOnly < ActiveRecord::Migration
  def self.up
    say_with_time "Making alternative title metadata field contribution-only" do
      if field = MetadataField.find_by_name('alternative')
        field.update_attribute(:attachment, false)
      else
        say "Alternative title metadata field not found; skipping."
      end
    end
  end

  def self.down
    say_with_time "Making alternative title metadata field contribution and attachment" do
      if field = MetadataField.find_by_name('alternative')
        field.update_attribute(:attachment, true)
      else
        say "Alternative title metadata field not found; skipping."
      end
    end
  end
end
