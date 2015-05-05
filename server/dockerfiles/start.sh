#!/bin/bash

LOCAL_REPO=$(git rev-parse --show-toplevel)
cd $LOCAL_REPO
cd server
if [[ -f 'server/dockerfiles/repo-key' ]] ; then
    mv server/dockerfiles/repo-key /root/.ssh/id_rsa
fi

url=$MONGO_URL || $MONGOLAB_URI || $MONGOHQ_URL || $OPENSHIFT_MONGODB_DB_URL
if [[ "$url" != "" ]]; then
  echo "Using MONGO_URL";

  #NODE_ENV=production node app.js
  NODE_ENV=production supervisor --watch . --extensions 'node,js,css,html' app.js
else
  echo "Using local mongodb server(not recommended)"
  
  mongod &
  echo "Wait until mongo started"
  sleep 30
  cd server 
  NODE_ENV=production supervisor --watch . --extensions 'node,js,css,html' app.js
  #NODE_ENV=production node app.js
fi
