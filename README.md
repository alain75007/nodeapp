# NodeApp
### Appplication
Main Mean application 
---

To use it, simply:

* Type Markdown text in the left pane
* See the HTML in the right

**WriteMe.md** also supports GitHub-style syntax highlighting for numerous languages, like so:

# Installation

### mongodb

### Development environment
```bash
sudo npm install -g bower grunt-cli jade coffee karma-cli node-inspector supervisor
sudo npm install -g yo yo-angular-fullstack
git clone ...
cd $_
bower install
npm install
```

###  Utilisation
#### Start server
#### Mode debug[:debug]
#### test
#### build

---

# Auto deploy
# see http://yeoman.io/learning/deployment.html

# Docker 

## Build

### generate ssh for bitbucket deployment key

```bash
ssh-keygen -q -t rsa -N '' -f repo-key
```

and create a POST hook on bitbucket


### Build and image

```bash
docker build -t alain75007/nodeapp .
```

## Create a container

### Case 1 :  use embeded mongodb 

```bash
docker run -it --name nodeapp_production_1 -p 10002:8080 -d alain75007/nodeapp
```

### Case 2 :  use a mongodb container

```bash
docker run --name mongo --link 10001:27017  -d mongo:latest  
docker run -it --name nodeapp_production_1 -p 10002:8080 --link mongo:mongo -e MONGO_URL=mongodb://mongo/nodeapp_production -d alain75007/nodeapp
```

### Case 3 : use an external  mongodb server

```bash
MONGO_URL=mongodb://u:p@externalhost:port/db
docker run -p 10002:8080 -e MONGO_URL=$MONGO_URL -d  alain75007/nodeapp
```


## Use the container

### Create a container and Override entrypoint

```bash
docker run -it --name nodeapp_production_1 --entrypoint /bin/bash -p 10002:8080 --link mongo:mongo -e MONGO_URL=mongodb://mongo/nodeapp_production alain75007/nodeapp
```

### connect to a running containier

```bash
docker exec -it nodeapp_production_1 /bin/bash
```

### show logs 

```bash
docker logs nodeapp_production_1
```


### show logs and following messages

```bash
docker logs -f nodeapp_production_1
```


---

To learn the basics of using Markdown, **[read this](http://daringfireball.net/projects/markdown/basics)**.


