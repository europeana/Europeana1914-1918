module RDF
  ##
  # WGS84 Geo Positioning vocabulary.
  class WGS84Pos < Vocabulary("http://www.w3.org/2003/01/geo/wgs84_pos#")
    property :altitude
    property :latitude
    property :lat_long
    property :location
    property :longitude
    property :Point
    property :SpatialThing
  end
end
