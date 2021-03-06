FROM ruby:1.9.3

RUN echo 'Acquire::Check-Valid-Until "false";' >> /etc/apt/apt.conf \
  && echo "deb http://archive.debian.org/debian jessie-backports main" >> /etc/apt/sources.list \
  && apt-get update \
  && apt-get install -y libcurl4-gnutls-dev libmysqlclient-dev curl git file \
     ffmpeg ghostscript imagemagick ssmtp nodejs \
  && rm -rf /var/lib/apt/lists/*

ENV DEBIAN_FRONTEND noninteractive
ENV RAILS_ENV development
ENV PORT 3000

WORKDIR /app

RUN mkdir -p log tmp/files

COPY vendor vendor
COPY Gemfile Gemfile.lock ./

RUN bundle install --system --full-index

COPY . .

CMD bundle exec thin start -p ${PORT}
