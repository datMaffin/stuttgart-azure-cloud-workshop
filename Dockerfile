FROM node:alpine

COPY . /build
WORKDIR /build
RUN yarn install
CMD ["yarn", "start"]
