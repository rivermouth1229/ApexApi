FROM node:14

WORKDIR /usr/var/
COPY package.json .
COPY app/ app/
RUN npm install
RUN npx prisma generate

CMD [ "node", "app/Server.js" ]
