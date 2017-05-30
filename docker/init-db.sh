#!/bin/bash
docker exec -i -t docker_web_1 bundle exec rake db:schema:load
docker exec -i -t docker_web_1 bundle exec rake db:seed
docker exec -i -t docker_web_1 bundle exec rake sunspot:reindex
docker restart docker_web_1
