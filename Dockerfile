FROM node:20-alpine AS base

RUN apk add --no-cache tzdata

# Set the timezone to Asia/Tehran
RUN cp /usr/share/zoneinfo/Asia/Tehran /etc/localtime && echo "Asia/Tehran" > /etc/timezone

FROM base AS deps
WORKDIR /temp-deps
COPY package*.json ./
RUN yarn install

FROM base AS builder
WORKDIR /build
COPY . ./
COPY --from=deps /temp-deps/node_modules ./node_modules

# Check if a build script exists and run the build if it does
RUN if [ -f package.json ] && grep -q '"build":' package.json; then yarn build; fi
RUN yarn install --production --frozen-lockfile


FROM base AS runner
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

COPY --from=builder /build ./

# RUN chown -R appuser:appgroup /app

# USER appuser

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
