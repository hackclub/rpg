ARG BUN_VERSION=1.2.2
ARG NODE_VERSION=23.7.0
FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-slim

RUN apt-get update
RUN apt-get install --no-install-recommends -y curl

WORKDIR /app
COPY package.json bun.lock ./

RUN bun install 

WORKDIR /app
COPY . . 
RUN bun prisma migrate deploy && \
    bun prisma generate && \
    bun prisma db seed

RUN bun run build

EXPOSE 3000


CMD ["bun", "run", "start"]
