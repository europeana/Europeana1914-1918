FROM mysql:5.5
COPY mysql/mysqld.cnf /etc/mysql/conf.d/
COPY mysql/*.sql /docker-entrypoint-initdb.d/
