FROM node:16-alpine

WORKDIR /app

COPY package.json package.json

RUN yarn install

COPY . /app

RUN yarn build

ENTRYPOINT ["node", "dist/"]