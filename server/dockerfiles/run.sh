# docker run --name mongo --link 10001:27017  -d mongo:latest  
docker run --name nodeapp_production_1 --link mongo:mongo -e $MONGO_URL=mongodb://mongo/nodeapp_production -d  alain75007/nodeapp
