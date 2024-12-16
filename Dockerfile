# Use the official Node.js image
FROM node:20-alpine AS base

RUN apk add --no-cache tzdata

# Set the working directory in the container

# Copy package.json a nd package-lock.json
# COPY package*.json ./

# Install dependencies
FROM base AS deps
WORKDIR /temp-deps
COPY package*.json ./
RUN yarn install

FROM base AS builder
WORKDIR /build
COPY . ./
COPY --from=deps /temp-deps/node_modules ./node_modules

RUN if [ -f package.json ] && grep -q '"build":' package.json; then yarn build; fi
RUN yarn install --production --frozen-lockfile

WORKDIR /app

COPY --from=builder /build ./

ENV NODE_ENV=production

EXPOSE 3500

CMD ["npm", "run", "start:prod"]
