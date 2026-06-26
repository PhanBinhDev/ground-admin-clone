# syntax=docker/dockerfile:1

# ---- deps: install with the committed bun lockfile ----
FROM oven/bun:1 AS deps
WORKDIR /app
ENV HUSKY=0
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- builder: build the standalone Next.js output ----
FROM oven/bun:1 AS builder
WORKDIR /app
ENV HUSKY=0 NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* are inlined into the client bundle at BUILD time → must be present here.
# Coolify passes these as build args (mark them as "Build Variable" in the UI).
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_AUTH_SERVER_URL
ARG NEXT_PUBLIC_SSO_CLIENT_ID
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_AUTH_SERVER_URL=$NEXT_PUBLIC_AUTH_SERVER_URL \
    NEXT_PUBLIC_SSO_CLIENT_ID=$NEXT_PUBLIC_SSO_CLIENT_ID \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN NODE_OPTIONS="--max-old-space-size=4096" bunx next build

# ---- runner: tiny production image ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
