# ─── Builder Stage ─────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (cached layer)
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# ─── Production Stage ──────────────────────────
FROM node:20-alpine

RUN addgroup -S mergemind && adduser -S mergemind -G mergemind

WORKDIR /app

# Copy built assets
COPY --from=builder --chown=mergemind:mergemind /app/.next ./.next
COPY --from=builder --chown=mergemind:mergemind /app/public ./public
COPY --from=builder --chown=mergemind:mergemind /app/package.json .
COPY --from=builder --chown=mergemind:mergemind /app/node_modules ./node_modules

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

USER mergemind

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:3000 || exit 1

EXPOSE 3000

CMD ["npx", "next", "start"]