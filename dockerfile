FROM node:21-alpine3.19

WORKDIR /usr/src/app

# this * includes the lock
COPY package*.json ./ 

RUN yarn install

COPY . .

# RUN yarn prisma generate

EXPOSE 3003
