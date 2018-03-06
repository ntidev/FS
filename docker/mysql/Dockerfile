FROM mysql:8

RUN mkdir /var/lib/mysql-files

# Copy MySQL configuration files
COPY ./my.cnf /etc/mysql/my.cnf

# Install dependencies
RUN apt-get update && apt-get install -y nano htop

