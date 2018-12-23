# Jedi Path
## Setting Up
In First, you need install:
- nodejs 10.x
- yarn
- lerna

After installing all entities run dependencies installation
```
lerna bootstrap
```
## Run Gateway
```
lerna --scope @etl/swt-gateway run dev --stream
```
# Sith Path

## Install Dep's
```
docker-compose run yarn
```
## Setup Gateway
```
docker-compose up swt-gateway
```

## For stage imitation just run
```
docker-compose up
```
