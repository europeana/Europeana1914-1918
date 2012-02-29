class MakeAlternativeTitleFieldRequired < ActiveRecord::Migration
  def self.up
    say_with_time "Making alternative title metadata field required" do
      if field = MetadataField.find_by_name('alternative')
        field.update_attribute(:required, true)
      else
        say "Alternative title metadata field not found; skipping."
      end
    end
  end

  def self.down
    say_with_time "Making alternative title metadata field optional" do
      if field = MetadataField.find_by_name('alternative')
        field.update_attribute(:required, false)
      else
        say "Alternative title metadata field not found; skipping."
      end
    end
  end
end
