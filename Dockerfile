ARG BUN_VERSION=1.2.2
ARG NODE_VERSION=23.7.0
FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-slim AS base

FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./

RUN bun install 

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . . 
RUN bun prisma migrate deploy && \
    bun prisma generate && \
    bun prisma db seed

RUN bun run build

FROM base AS runner
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./.next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/public ./.next/standalone/public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/standalone/.next/static

EXPOSE 3000


CMD ["node", "/home/bun/app/.next/standalone/server.js"]
