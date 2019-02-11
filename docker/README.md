Docker for Europeana 1914-1918
==============================

## Configuration

1. Copy all files in `docker/web/config/` to `config/` in your cloned repo:
  `cp -r docker/web/config/. config`

## Initialisation

From this directory, run `init-db.sh`

## Usage

1. From this directory, run: `docker-compose up`
2. The web application will be accessible at http://localhost:30000/

## Services

* web: 1914-1918 application (Rails / Thin), on host port 30000
* db: MySQL 5.5, on host port 30001
* search: Solr 4.1, on host port 30002
