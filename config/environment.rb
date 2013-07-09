# Load the rails application
require File.expand_path('../application', __FILE__)

# Load the RunCoCo library (before initializers)
require 'runcoco'

# Initialize the rails application
RunCoCo::Application.initialize!
