FROM mcandre/docker-solr:4.10.0

ENV SOLR_HOME /solr-4.10.0/server

WORKDIR /solr-4.10.0

RUN mkdir server \
    && cd example \
    && cp -r contexts etc lib resources start.jar webapps ../server \
    && cd .. && rm -r example

COPY solr/solr.xml server/solr.xml
COPY solr/1418 server/1418
