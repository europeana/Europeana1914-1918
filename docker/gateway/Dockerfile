FROM nginx:stable

RUN apt-get update && apt-get install -y inetutils-ping curl

COPY nginx/conf.d/* /etc/nginx/conf.d/
