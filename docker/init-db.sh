#!/bin/bash

docker-compose up -d db search
docker-compose run web bundle exec rake db:seed
docker-compose run web bundle exec rake sunspot:reindex
docker-compose down
