# Build stage
FROM node:20-alpine AS builder

RUN apk add --no-cache tzdata

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production stage
FROM node:20-alpine AS production

RUN apk add --no-cache tzdata

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3500

CMD ["yarn", "start:prod"]