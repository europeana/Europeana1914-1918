Docker for Europeana 1914-1918
==============================

== Configuration

1. Copy all files in `docker/web/config/` to `config/` in your cloned repo:
  `cp -r docker/web/config/. config`

== Usage

1. Change to this directory (`docker`), then run: `docker-compose up`
2. The first time you have it running, you will need to init the db with
  `init-db.sh`
3. Ports are randomly assigned, so list them with `docker ps` to see where
  the web app is listening

== Services

* web: 1914-1918 application (Rails / Thin)
* db: MySQL 5.5
* search: Solr 4.1
