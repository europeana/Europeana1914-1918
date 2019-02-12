FROM ruby:1.9.3

ENV DEBIAN_FRONTEND noninteractive
ENV RAILS_ENV development

RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list \
  && apt-get update \
  && apt-get install -y libcurl4-gnutls-dev libmysqlclient-dev curl git file \
     ffmpeg ghostscript imagemagick sendmail nodejs \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN mkdir log tmp

COPY vendor vendor
COPY Gemfile Gemfile.lock ./

RUN bundle install --system --full-index

COPY . .

CMD bundle exec thin start -p 3000
