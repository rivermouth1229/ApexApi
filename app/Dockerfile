FROM node:14

WORKDIR /usr/var/
COPY package.json .
COPY app/ app/
RUN npm install

CMD [ "node", "app/Server.js" ]
