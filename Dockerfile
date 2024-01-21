FROM node:16.13.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript

COPY . .

CMD [ "npm", "start" ]

