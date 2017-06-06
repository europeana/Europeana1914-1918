FROM centurylink/ruby-base:1.9.3-p551

WORKDIR /app

ENV DEBIAN_FRONTEND noninteractive
ENV RAILS_ENV development

RUN echo "deb http://ftp.debian.org/debian wheezy-backports main" \
  >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y \
  libcurl4-gnutls-dev libmysqlclient-dev \
  curl git \
  file ffmpeg ghostscript imagemagick
RUN apt-get install -t wheezy-backports -y nodejs
RUN rm -rf /var/lib/apt/lists/*

VOLUME /app

CMD bundle install --system --full-index && \
  bundle exec thin start -p 3000
