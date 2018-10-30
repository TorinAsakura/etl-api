FROM node as builder

RUN mkdir /app

ADD . /app

WORKDIR /app

RUN yarn install

FROM node

ENV NODE_ENV=production
ENV TS_NODE_TRANSPILE_ONLY=true

COPY --from=builder /app /app
