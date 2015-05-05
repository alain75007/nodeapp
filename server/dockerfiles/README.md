# generate ssh for bitbucket deployment key
ssh-keygen -q -t rsa -N '' -f repo-key

# build
docker build -t alain75007/nodeapp .

# use embeded mongodb 
docker run -it --name nodeapp_production_1 -p 10002:8080 alain75007/nodeapp

# use a mongodb container
docker run -it --name nodeapp_production_1 -p 10002:8080 --link mongo:mongo -e MONGO_URL=mongodb://mongo/nodeapp_production alain75007/nodeapp

# Override entrypoint
docker run -it --name nodeapp_production_1 --entrypoint /bin/bash -p 10002:8080 --link mongo:mongo -e MONGO_URL=mongodb://mongo/nodeapp_production alain75007/nodeapp

# connect to a running containier
docker exec -it nodeapp_production_1 /bin/bash

