# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#   
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Major.create(:name => 'Daley', :city => cities.first)
admin = User.new(:email => 'admin@example.com', :password => 'secret', :password_confirmation => 'secret', :contact_attributes => { :full_name => 'Admin' })
admin.role_name = 'administrator'
admin.save

CoCoCo.configuration.save
