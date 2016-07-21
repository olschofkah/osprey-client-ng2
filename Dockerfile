FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

VOLUME /var/log

#EXPOSE 8080
EXPOSE 3000

CMD [ "npm", "start" ]