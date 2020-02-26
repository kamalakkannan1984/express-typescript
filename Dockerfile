FROM alpine:latest

RUN apk add --no-cache nodejs yarn

WORKDIR /usr/src/app

COPY package.json .

RUN yarn

COPY dist .

EXPOSE 3000

CMD [ "yarn", "start:prod" ]
