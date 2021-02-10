FROM node:14

WORKDIR /usr/var/
COPY package.json .
RUN npm install

CMD [ "node", "app/Server.js" ]
