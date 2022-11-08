FROM node:16-alpine

COPY package.json package.json

RUN yarn install

COPY . .

RUN yarn build

CMD ["node", "dist/"]