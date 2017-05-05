FROM centurylink/ruby-base:1.9.3-p551

WORKDIR /app

ENV DEBIAN_FRONTEND noninteractive
ENV RAILS_ENV development

RUN apt-get update && apt-get -y dist-upgrade

RUN apt-get install -y apt-utils

RUN apt-get install -y \
  libcurl4-gnutls-dev libmysqlclient-dev \
  curl git default-jre mysql-server unzip\
  ffmpeg ghostscript imagemagick

RUN echo "deb http://ftp.debian.org/debian wheezy-backports main" \
  >> /etc/apt/sources.list && \
  apt-get update && \
  apt-get install -t wheezy-backports -y nodejs

RUN rm -rf /var/lib/apt/lists/*

RUN echo "[mysqld]" > /etc/mysql/conf.d/bind_address.cnf && \
  echo "bind-address=*" >> /etc/mysql/conf.d/bind_address.cnf

RUN service mysql start && \
  mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';" && \
  mysql -u root -e "CREATE USER '1418'@'localhost' IDENTIFIED BY '1418pass';" && \
  mysql -u root -e "CREATE DATABASE europeana_1418 CHARACTER SET utf8 COLLATE utf8_general_ci;" && \
  mysql -u root -e "GRANT ALL PRIVILEGES ON europeana_1418.* TO '1418'@'localhost';"

RUN mkdir /root/docker
ADD . /root/docker

RUN curl -OL https://github.com/europeana/Europeana1914-1918/archive/develop.zip
RUN unzip develop.zip
RUN cp -r Europeana1914-1918-develop/. .
RUN rm -r Europeana1914-1918-develop develop.zip
RUN cp -r /root/docker/app/. .
RUN bundle install --system --full-index
RUN echo "RunCoCo::Application.config.secret_token = '`bundle exec rake secret`'" > config/initializers/secret_token.rb
RUN mkdir -p /root/docker/app/config/initializers && cp config/initializers/secret_token.rb /root/docker/app/config/initializers/secret_token.rb

RUN service mysql start && bundle exec rake sunspot:solr:start && bundle exec rake db:setup

VOLUME /app

EXPOSE 3306 3000

CMD service mysql start && cp -r /root/docker/app/. /app && \
  bundle install --system --full-index && \
  bundle exec rake sunspot:solr:start && \
  bundle exec thin start -p 3000
