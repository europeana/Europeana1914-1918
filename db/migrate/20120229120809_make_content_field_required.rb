class MakeContentFieldRequired < ActiveRecord::Migration
  def self.up
    say_with_time "Making content metadata field required" do
      if field = MetadataField.find_by_name('content')
        field.update_attribute(:required, true)
      else
        say "Content metadata field not found; skipping."
      end
    end
  end

  def self.down
    say_with_time "Making content metadata field optional" do
      if field = MetadataField.find_by_name('content')
        field.update_attribute(:required, false)
      else
        say "content metadata field not found; skipping."
      end
    end
  end
end
