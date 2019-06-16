FROM node:8-alpine

WORKDIR /

RUN apk add \
    build-base \
    libtool \
    autoconf \
    automake \
    jq \
    openssh \
    python 

COPY package.json package.json
RUN npm install
# RUN mv /app/node_modules /node_modules

COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build

ENTRYPOINT npm run start:prod