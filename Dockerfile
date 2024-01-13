FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install docker.js

COPY . .

CMD [ "node", "src/index.js" ]