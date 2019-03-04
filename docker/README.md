Docker for Europeana 1914-1918
==============================

## Configuration

1. Copy all files in `docker/web/config/` to `config/` in your cloned repo:
  `cp -r docker/web/config/. config`

## Initialisation

From this directory, run `init.sh`

## Usage

1. From this directory, run: `docker-compose up`
2. The web application will be accessible at http://localhost/ (port 80)

## Services

* db: MySQL 5.5
* gateway: NGINX stable
* search: Solr 4.1
* web: 1914-1918 application (Rails / Thin)
* worker: 1914-1918 application (Rails / Delayed::Job)
