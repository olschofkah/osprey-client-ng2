#!/bin/bash

cat Dockerfile

DOCKER_AWS_LOGIN=`aws ecr get-login --region us-east-1`

echo "${DOCKER_AWS_LOGIN}"

${DOCKER_AWS_LOGIN}

docker build -t osprey/client .

VERSION=0.0.2 #Find the version from the build somehow ... 

# Tag the build
#docker tag osprey/client:${VERSION} 620041067453.dkr.ecr.us-east-1.amazonaws.com/osprey/client:${VERSION}

# Push the build to AWS EC2 Container Manager
#docker push 620041067453.dkr.ecr.us-east-1.amazonaws.com/osprey/client:${VERSION}

# Tag the build
docker tag osprey/client:latest 620041067453.dkr.ecr.us-east-1.amazonaws.com/osprey/client:latest

# Push the build to AWS EC2 Container Manager
docker push 620041067453.dkr.ecr.us-east-1.amazonaws.com/osprey/client:latest