FROM dockerfile/nodejs
MAINTAINER Alain Beauvois alain@questioncode.fr

# Install Bower & Grunt
#RUN npm install -g bower grunt-cli supervisor
RUN npm install -g supervisor
#

#RUN echo deb http://archive.ubuntu.com/ubuntu precise universe >> /etc/apt/sources.list
#RUN apt-get update -y
#
##install dependencies
#RUN apt-get -y install build-essential libssl-dev wget
#
##configuration for node
#ENV NODE_VERSION 0.10.21
#ENV NODE_ARCH x64
#
##installation node
WORKDIR /tmp
#RUN wget http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$NODE_ARCH.tar.gz
#RUN tar xvzf node-v$NODE_VERSION-linux-$NODE_ARCH.tar.gz
#RUN rm -rf /opt/nodejs
#RUN mv node-v$NODE_VERSION-linux-$NODE_ARCH /opt/nodejs
#
#RUN ln -sf /opt/nodejs/bin/node /usr/bin/node
#RUN ln -sf /opt/nodejs/bin/npm /usr/bin/npm

#install mongodb
RUN \
        apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
        echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
        apt-get update && \
        apt-get install -y mongodb-org && \
        rm -rf /var/lib/apt/lists/*

#db setup
RUN mkdir -p /data/db

#install ruby
#RUN \
#  apt-get update && \
#  apt-get install -y ruby ruby-dev ruby-bundler && \
#  rm -rf /var/lib/apt/lists/*

#install compass jade and sass
#RUN gem install sass compass

#RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
#RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/10gen.list
#RUN apt-get update -y
#RUN apt-get install mongodb-10gen=2.4.5

#initialize system
RUN mkdir -p /opt
WORKDIR /opt

#RUN npm install -g node-gyp

#downloading application 

# Copy over private key, and set permissions
ADD server/dockerfiles/repo-key /root/.ssh/id_rsa
#
# # Create known_hosts
RUN touch /root/.ssh/known_hosts
# # Add bitbuckets key
RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts
#
# # Clone the conf files into the docker container
#RUN git clone git@bitbucket.org:alain_beauvois/nodeapp.git
RUN cd /opt && git clone -b build --single-branch git@bitbucket.org:alain_beauvois/nodeapp.git

WORKDIR /opt/nodeapp

#RUN bower --allow-root install
RUN npm install

#copy running scripts
#ADD dockerfiles/start.sh /opt/nodeapp/start.sh
#RUN chmod u+x *.sh

ENTRYPOINT ["bash", "server/dockerfiles/start.sh"]


