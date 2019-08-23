class OAIRecord < ActiveRecord::Base
  belongs_to :metadata_mapping

  validates :identifier, :metadata_prefix, :presence => true
  validates :identifier, :uniqueness => { :scope => :metadata_prefix }

  ##
  # OAI sets are not implemented
  #
  def self.sets
    nil
  end

  def sets
    self.class.sets
  end

  def to_oai_edm
    metadata_mapping.content.sub(/<\?xml .*? ?>/, "")
  end
end
