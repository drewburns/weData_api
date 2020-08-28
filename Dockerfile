FROM node:10.0.0-alpine
WORKDIR /usr/app
COPY package.json .
COPY . .
RUN npm i -g --quiet npx
RUN npm install --save-dev --quiet sequelize-cli
RUN npm install --save-dev --quiet nodemon
# RUN npx sequelize-cli db:migrate
RUN npm install --quiet
