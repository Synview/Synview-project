FROM node:18 AS prisma-builder

WORKDIR /app

COPY Synview-backend/package.json ./package.json
COPY Synview-backend/prisma ./prisma
COPY Synview-backend/ ./Synview-backend

RUN npm install

RUN npx prisma generate --schema=./Synview-backend/prisma/schema.prisma

FROM denoland/deno:alpine-1.42.1

WORKDIR /app

COPY Synview-backend/ .

COPY common ./common

EXPOSE 8080

CMD ["deno", "run", "--allow-env", "--allow-read", "--allow-ffi", "--allow-net", "--unstable-broadcast-channel", "index.ts"]