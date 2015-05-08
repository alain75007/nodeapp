FROM dockerfile/nodejs
MAINTAINER Alain Beauvois alain@questioncode.fr

# Install Bower & Grunt
#RUN npm install -g bower grunt-cli supervisor
RUN npm install -g supervisor
#

WORKDIR /tmp

#install mongodb
RUN \
        apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
        echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
        apt-get update && \
        apt-get install -y mongodb-org && \
        rm -rf /var/lib/apt/lists/*
#db setup
RUN mkdir -p /data/db

# Copy over private key, and set permissions
ADD server/dockerfiles/repo-key /root/.ssh/id_rsa
#
# Create known_hosts
RUN touch /root/.ssh/known_hosts
# # Add bitbuckets key
RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts
#

# Clone application
RUN mkdir -p /opt
RUN cd /opt && git clone -b build --single-branch git@bitbucket.org:alain_beauvois/nodeapp.git

WORKDIR /opt/nodeapp

RUN npm install

ENTRYPOINT ["bash", "server/dockerfiles/start.sh"]

