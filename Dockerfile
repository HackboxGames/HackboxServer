FROM node:18-alpine AS deps

WORKDIR /hackbox
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

FROM node:18-alpine AS builder

WORKDIR /hackbox
COPY --from=deps /hackbox/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:18-alpine AS runner

RUN apk update && apk upgrade
ENV NODE_ENV production
WORKDIR /hackbox
COPY --from=builder /hackbox ./

EXPOSE 4444

VOLUME /bundles \
    /mods

CMD [ "yarn", "start" ]