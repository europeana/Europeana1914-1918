#!/bin/bash

docker-compose up -d db search
docker-compose run --no-deps web bundle exec rake db:seed
docker-compose run --no-deps web bundle exec rake sunspot:reindex
docker-compose run --no-deps web bundle exec rake assets:precompile
docker-compose down
